"""
===============================================================================
MAHARASHTRA HTE DECISION INTELLIGENCE PLATFORM
Predictive Enrollment Model - Interactive Testing Script v3.0
===============================================================================
Usage:
  Interactive:  python test_prediction.py
  Batch Demo:   python test_prediction.py --demo
===============================================================================
"""

import os
import sys
import argparse

import ml_pipeline
from ml_pipeline import (
    DataCleaner, FeatureEngineer, DataLoader, FeatureSelector,
    ModelTrainer, EnrollmentPredictor, ExplainablePredictor,
    HistoricalDataSynthesizer
)

sys.modules['__main__'].DataCleaner = DataCleaner
sys.modules['__main__'].FeatureEngineer = FeatureEngineer


def print_banner():
    print("=" * 70)
    print("  [HTE] MAHARASHTRA ENROLLMENT PREDICTOR v3.0")
    print("  Audited Domain-Constrained Intelligence Platform")
    print("=" * 70)


def display_result(result: dict):
    if "error" in result:
        print(f"  ERROR: {result['error']}\n")
        return

    print(f"\n  College Name            : {result['college_name']}")
    print(f"  Target Year             : {result['target_year']}")
    print(f"  Admission Capacity      : {result['admission_capacity']} seats")
    print(f"  PREDICTED ENROLLMENT    : {result['predicted_enrollment']} students")
    print(f"  Seat Utilization        : {result['seat_utilization_pct']}%")
    print(f"  Growth Rate             : {result['growth_rate_pct']}%")
    print(f"  Prediction Confidence   : {result['prediction_confidence_pct']}% (Tree-variance based)")
    print(f"  Prediction Std Dev      : {result.get('prediction_std_dev', 0.0)}")
    print(f"\n  Reason Summary          :\n    {result.get('reason_summary', '')}")

    print("\n  Top Influencing Features (SHAP / Feature Contributions):")
    for f in result.get("top_influencing_features", []):
        name = f['feature'].replace('_', ' ').title()
        print(f"    * {name:<30} | Weight: {f['importance']:.4f} | Val: {f['value']} | Impact: {f['impact']}")
    print("-" * 70 + "\n")


def run_demo(predictor):
    print("\n Running Predefined Test Scenarios (Tasks 6 Verification)...\n")

    tests = [
        {
            "name": "VJTI Mumbai (Premier Engineering)",
            "year": 2025,
            "data": {
                "sanctioned_seats": 120, "filled_seats": 100, "applications": 400,
                "placement_rate": 80.0, "avg_package": 12.0, "cutoff_percentile": 92.0,
                "faculty_count": 17, "naac_grade": "A++", "district": "Mumbai"
            }
        },
        {
            "name": "COEP Pune (Premier Engineering)",
            "year": 2025,
            "data": {
                "sanctioned_seats": 120, "filled_seats": 115, "applications": 300,
                "placement_rate": 90.0, "avg_package": 14.0, "cutoff_percentile": 95.0,
                "faculty_count": 25, "naac_grade": "A+", "district": "Pune"
            }
        },
        {
            "name": "Average Tier-2 College (Nashik)",
            "year": 2025,
            "data": {
                "sanctioned_seats": 120, "filled_seats": 85, "applications": 180,
                "placement_rate": 65.0, "avg_package": 5.5, "cutoff_percentile": 60.0,
                "faculty_count": 10, "naac_grade": "B++", "district": "Nashik"
            }
        },
        {
            "name": "New Rural College (Latur)",
            "year": 2025,
            "data": {
                "sanctioned_seats": 120, "filled_seats": 50, "applications": 70,
                "placement_rate": 40.0, "avg_package": 3.0, "cutoff_percentile": 35.0,
                "faculty_count": 6, "naac_grade": "C", "district": "Latur"
            }
        },
    ]

    for i, t in enumerate(tests, 1):
        print(f"--- Scenario #{i}: {t['name']} ---")
        res = predictor.predict_enrollment(t['name'], t['year'], t['data'])
        display_result(res)


def interactive_mode(predictor):
    print("\n ENTER CUSTOM COLLEGE DETAILS FOR PREDICTION")
    print("-" * 55)
    try:
        name = input("College Name [VJTI Mumbai]: ").strip() or "VJTI Mumbai"
        year = int(input("Target Year [2025]: ").strip() or "2025")
        district = input("District [Mumbai]: ").strip() or "Mumbai"
        seats = int(input("Sanctioned Seats [120]: ").strip() or "120")
        filled = int(input("Current Filled Seats [100]: ").strip() or "100")
        apps = int(input("Applications Received [400]: ").strip() or "400")
        placement = float(input("Placement Rate % [80]: ").strip() or "80")
        pkg = float(input("Avg Package LPA [12.0]: ").strip() or "12.0")
        cutoff = float(input("Cutoff Percentile [92]: ").strip() or "92")
        faculty = int(input("Faculty Count [17]: ").strip() or "17")
        naac = input("NAAC Grade [A++]: ").strip() or "A++"

        data = {
            "district": district, "sanctioned_seats": seats,
            "filled_seats": filled, "applications": apps,
            "placement_rate": placement, "avg_package": pkg,
            "cutoff_percentile": cutoff, "faculty_count": faculty,
            "naac_grade": naac,
        }

        print("\n Computing realistic domain prediction...")
        res = predictor.predict_enrollment(name, year, data)
        display_result(res)

    except KeyboardInterrupt:
        print("\n\nCancelled.")
    except Exception as e:
        print(f"\n Error: {e}")


def main():
    parser = argparse.ArgumentParser(description="Test HTE Enrollment Predictor v3.0")
    parser.add_argument("--demo", action="store_true", help="Run automated demo scenarios")
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
