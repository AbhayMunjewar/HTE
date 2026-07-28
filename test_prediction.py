"""
===============================================================================
MAHARASHTRA HTE DECISION INTELLIGENCE PLATFORM
Predictive Enrollment Model - Interactive Testing Script v2.0
===============================================================================
Usage:
  Interactive:  python test_prediction.py
  Batch Demo:   python test_prediction.py --demo
===============================================================================
"""

import os
import sys
import argparse

# Ensure joblib can unpickle pipeline classes
import ml_pipeline
from ml_pipeline import (
    DataCleaner, FeatureEngineer, DataLoader, FeatureSelector,
    ModelTrainer, EnrollmentPredictor, ConfidenceEstimator
)
sys.modules['__main__'].DataCleaner = DataCleaner
sys.modules['__main__'].FeatureEngineer = FeatureEngineer


def print_banner():
    print("=" * 70)
    print("  [HTE] MAHARASHTRA ENROLLMENT PREDICTOR v2.0")
    print("=" * 70)


def display_result(result: dict, seats: int = 120):
    if "error" in result:
        print(f"  ERROR: {result['error']}\n")
        return
    p = result["predicted_enrollment"]
    print(f"  Target Year             : {result['target_year']}")
    print(f"  Admission Capacity      : {seats} seats")
    print(f"  PREDICTED ENROLLMENT    : {p} students")
    print(f"  Seat Utilization        : {result['seat_utilization_pct']}%")
    print(f"  Growth Rate             : {result['growth_rate_pct']}%")
    print(f"  Prediction Confidence   : {result['prediction_confidence_pct']}%")
    print(f"  Prediction Std Dev      : {result.get('prediction_std', 'N/A')}")
    print("\n  Top Influencing Features:")
    for f in result.get("top_contributing_features", []):
        name = f['feature'].replace('_', ' ').title()
        print(f"    * {name:<30} | Weight: {f['importance']:.4f} | Value: {f['value']}")
    print("-" * 70 + "\n")


def run_demo(predictor):
    print("\n Running Predefined Test Scenarios...\n")

    tests = [
        {
            "name": "COEP Pune (Top Tier Engineering)",
            "year": 2025,
            "data": {
                "district": "Pune", "sanctioned_seats": 120,
                "filled_seats": 115, "applications": 800,
                "placement_rate": 92.0, "avg_package": 14.0,
                "cutoff_percentile": 95.0, "naac_grade": "A+",
                "nirf_rank": 50, "accreditation_score": 3.8,
                "established_year": 1854, "autonomous": "Yes",
                "student_satisfaction": 88.0, "avg_cgpa": 8.5,
                "faculty_count": 25, "phd_faculty_pct": 70.0,
                "avg_experience": 18.0, "research_publications": 100,
                "research_citations": 500, "infrastructure_score": 90.0,
                "overall_state_rank": 10, "graduation_rate": 95.0,
                "placement_rate_actual": 90.0, "avg_marks": 78.0,
                "pass_rate": 96.0,
            }
        },
        {
            "name": "VJTI Mumbai (Premier Institute)",
            "year": 2025,
            "data": {
                "district": "Mumbai City", "sanctioned_seats": 120,
                "filled_seats": 118, "applications": 900,
                "placement_rate": 90.0, "avg_package": 12.5,
                "cutoff_percentile": 93.0, "naac_grade": "A+",
                "nirf_rank": 60, "accreditation_score": 3.7,
                "established_year": 1887, "autonomous": "Yes",
                "student_satisfaction": 85.0, "avg_cgpa": 8.2,
                "faculty_count": 22, "phd_faculty_pct": 65.0,
                "avg_experience": 16.0, "research_publications": 80,
                "infrastructure_score": 85.0, "overall_state_rank": 15,
                "graduation_rate": 94.0, "placement_rate_actual": 88.0,
            }
        },
        {
            "name": "Mid-Tier Private College, Nashik",
            "year": 2025,
            "data": {
                "district": "Nashik", "sanctioned_seats": 120,
                "filled_seats": 85, "applications": 250,
                "placement_rate": 65.0, "avg_package": 5.5,
                "cutoff_percentile": 55.0, "naac_grade": "B",
                "nirf_rank": 300, "accreditation_score": 2.5,
                "established_year": 2005, "autonomous": "No",
                "student_satisfaction": 65.0, "avg_cgpa": 6.8,
                "faculty_count": 10, "phd_faculty_pct": 25.0,
                "avg_experience": 8.0, "research_publications": 5,
                "overall_state_rank": 800, "graduation_rate": 78.0,
                "placement_rate_actual": 55.0,
            }
        },
        {
            "name": "New Rural College, Latur",
            "year": 2025,
            "data": {
                "district": "Latur", "sanctioned_seats": 120,
                "filled_seats": 50, "applications": 100,
                "placement_rate": 40.0, "avg_package": 3.0,
                "cutoff_percentile": 35.0, "naac_grade": "C",
                "nirf_rank": 800, "accreditation_score": 1.5,
                "established_year": 2018, "autonomous": "No",
                "student_satisfaction": 55.0, "avg_cgpa": 6.0,
                "faculty_count": 6, "phd_faculty_pct": 10.0,
                "avg_experience": 5.0, "research_publications": 0,
                "overall_state_rank": 1800, "graduation_rate": 65.0,
                "placement_rate_actual": 30.0,
            }
        },
    ]

    for i, t in enumerate(tests, 1):
        print(f"--- Test #{i}: {t['name']} ---")
        result = predictor.predict_enrollment(t['name'], t['year'], t['data'])
        display_result(result, t['data'].get('sanctioned_seats', 120))


def interactive_mode(predictor):
    print("\n ENTER CUSTOM COLLEGE DETAILS FOR PREDICTION")
    print("-" * 50)
    try:
        name = input("College Name [VJTI Mumbai]: ").strip() or "VJTI Mumbai"
        year = int(input("Target Year [2025]: ").strip() or "2025")
        district = input("District [Pune]: ").strip() or "Pune"
        seats = int(input("Sanctioned Seats [120]: ").strip() or "120")
        filled = int(input("Current Filled Seats [100]: ").strip() or "100")
        apps = int(input("Applications Received [400]: ").strip() or "400")
        placement = float(input("Placement Rate % [80]: ").strip() or "80")
        pkg = float(input("Avg Package LPA [8.0]: ").strip() or "8.0")
        cutoff = float(input("Cutoff Percentile [70]: ").strip() or "70")
        faculty = int(input("Faculty Count [15]: ").strip() or "15")
        naac = input("NAAC Grade [B+]: ").strip() or "B+"

        data = {
            "district": district, "sanctioned_seats": seats,
            "filled_seats": filled, "applications": apps,
            "placement_rate": placement, "avg_package": pkg,
            "cutoff_percentile": cutoff, "faculty_count": faculty,
            "naac_grade": naac,
        }

        print("\n Computing prediction...")
        result = predictor.predict_enrollment(name, year, data)
        display_result(result, seats)

    except KeyboardInterrupt:
        print("\n\nCancelled.")
    except Exception as e:
        print(f"\n Error: {e}")


def main():
    parser = argparse.ArgumentParser(
        description="Test HTE Enrollment Predictor v2.0")
    parser.add_argument("--demo", action="store_true",
                        help="Run automated demo scenarios")
    args = parser.parse_args()

    print_banner()

    models_dir = "models"
    if not os.path.exists(os.path.join(models_dir, "best_model.pkl")):
        print(" Model not found. Training pipeline first...")
        from ml_pipeline import run_pipeline
        run_pipeline()

    predictor = EnrollmentPredictor(models_dir=models_dir)

    if args.demo:
        run_demo(predictor)
    else:
        print("Choose Mode:")
        print("  1. Interactive Custom Input")
        print("  2. Run Predefined Demos")
        choice = input("\nChoice [1]: ").strip()
        if choice == "2":
            run_demo(predictor)
        else:
            interactive_mode(predictor)


if __name__ == "__main__":
    main()
