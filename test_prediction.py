"""
===============================================================================
MAHARASHTRA HIGHER & TECHNICAL EDUCATION (HTE) DECISION INTELLIGENCE PLATFORM
Predictive Enrollment Model Interactive Testing Script
===============================================================================
Use this script to test enrollment predictions for any college, department,
year, and operational metric.

Usage:
  1. Interactive CLI Mode: python test_prediction.py
  2. Batch Pre-defined Scenarios: python test_prediction.py --demo
===============================================================================
"""

import os
import sys
import argparse
import pandas as pd
import numpy as np
import joblib

# Import predictor engine and pipeline components from ml_pipeline
import ml_pipeline
from ml_pipeline import (
    HTEDataCleaner,
    HTEFeatureEngineer,
    HTEDataLoader,
    HTETargetGenerator,
    HTEFeatureSelector,
    HTEModelTrainer,
    HTEEnrollmentPredictor
)

# Ensure joblib unpickles custom classes cleanly
sys.modules['__main__'].HTEDataCleaner = HTEDataCleaner
sys.modules['__main__'].HTEFeatureEngineer = HTEFeatureEngineer


def print_banner():
    print("=" * 75)
    print(" [HTE] MAHARASHTRA DECISION INTELLIGENCE - ENROLLMENT PREDICTOR")
    print("=" * 75)


def run_predefined_scenarios(predictor: HTEEnrollmentPredictor):
    """Runs prediction test cases across top Maharashtra engineering institutes."""
    print("\n Running Predefined Test Scenarios Across Maharashtra Institutes...\n")
    
    test_cases = [
        {
            "college_name": "Veermata Jijabai Technological Institute (VJTI), Mumbai",
            "year": 2025,
            "data": {
                "district": "Mumbai",
                "department": "Computer Engineering",
                "seats_available": 120,
                "faculty_count": 14,
                "placement_pct": 92.5,
                "avg_package_lpa": 14.5,
                "infrastructure_score": 9.2,
                "funding_lakhs": 350.0
            }
        },
        {
            "college_name": "COEP Technological University, Pune",
            "year": 2026,
            "data": {
                "district": "Pune",
                "department": "Computer Engineering",
                "seats_available": 150,
                "faculty_count": 18,
                "placement_pct": 95.0,
                "avg_package_lpa": 16.0,
                "infrastructure_score": 9.5,
                "funding_lakhs": 420.0
            }
        },
        {
            "college_name": "Government College of Engineering, Chhatrapati Sambhaji Nagar",
            "year": 2025,
            "data": {
                "district": "Chhatrapati Sambhaji Nagar",
                "department": "Mechanical Engineering",
                "seats_available": 60,
                "faculty_count": 8,
                "placement_pct": 72.0,
                "avg_package_lpa": 6.8,
                "infrastructure_score": 7.8,
                "funding_lakhs": 180.0
            }
        },
        {
            "college_name": "Visvesvaraya National Institute of Technology (VNIT), Nagpur",
            "year": 2026,
            "data": {
                "district": "Nagpur",
                "department": "Electronics & Telecommunication",
                "seats_available": 120,
                "faculty_count": 12,
                "placement_pct": 86.0,
                "avg_package_lpa": 11.0,
                "infrastructure_score": 8.8,
                "funding_lakhs": 300.0
            }
        }
    ]

    for i, test in enumerate(test_cases, start=1):
        print(f"------------ Test Case #{i}: {test['college_name']} ------------")
        result = predictor.predict_enrollment(
            college_name=test["college_name"],
            year=test["year"],
            custom_data=test["data"]
        )
        display_result(result, test["data"])


def interactive_mode(predictor: HTEEnrollmentPredictor):
    """Allows user to enter custom inputs interactively in terminal."""
    print("\n ENTER CUSTOM COLLEGE DETAILS FOR PREDICTION")
    print("--------------------------------------------------")
    
    try:
        college_name = input("Enter College/Institute Name [Default: VJTI Mumbai]: ").strip()
        if not college_name:
            college_name = "VJTI Mumbai"

        year_str = input("Enter Target Year (e.g., 2025, 2026, 2027) [Default: 2026]: ").strip()
        year = int(year_str) if year_str.isdigit() else 2026

        district = input("Enter District (Pune/Mumbai/Nagpur/Nashik/Thane/Other) [Default: Mumbai]: ").strip()
        if not district:
            district = "Mumbai"

        dept = input("Enter Department [Default: Computer Engineering]: ").strip()
        if not dept:
            dept = "Computer Engineering"

        seats_str = input("Enter Admission Capacity / Seats Available [Default: 120]: ").strip()
        seats = int(seats_str) if seats_str.isdigit() else 120

        faculty_str = input("Enter Total Faculty Count [Default: 12]: ").strip()
        faculty = int(faculty_str) if faculty_str.isdigit() else 12

        placement_str = input("Enter Expected Placement Percentage (0-100) [Default: 85.0]: ").strip()
        placement = float(placement_str) if placement_str else 85.0

        pkg_str = input("Enter Average Placement Package in LPA [Default: 9.5]: ").strip()
        pkg = float(pkg_str) if pkg_str else 9.5

        custom_data = {
            "district": district,
            "department": dept,
            "seats_available": seats,
            "faculty_count": faculty,
            "placement_pct": placement,
            "avg_package_lpa": pkg,
            "infrastructure_score": 8.5,
            "funding_lakhs": 250.0
        }

        print("\n Computing ML Prediction...")
        result = predictor.predict_enrollment(college_name, year, custom_data)
        display_result(result, custom_data)

    except KeyboardInterrupt:
        print("\n\nTesting cancelled by user.")
    except Exception as e:
        print(f"\n Error processing input: {e}")


def display_result(result: dict, input_data: dict):
    """Formats and prints prediction output."""
    if "error" in result:
        print(f" Error: {result['error']}\n")
        return

    predicted = result["predicted_enrollment"]
    seats = input_data.get("seats_available", 120)
    fill_rate = round((predicted / max(1, seats)) * 100, 1)

    print(f"  Target Year              : {result['target_year']}")
    print(f"  Admission Capacity       : {seats} seats")
    print(f"  PREDICTED ENROLLMENT     : {predicted} Students ({fill_rate}% seat utilization)")
    print(f"  Prediction Confidence    : {result['prediction_confidence_pct']}%")
    print("\n  Key Drivers (Top Influencing Features):")
    for feat in result.get("top_contributing_features", []):
        f_name = feat['feature'].replace('_', ' ').title()
        print(f"     * {f_name:<28} | Weight: {feat['importance_weight']:.4f} | Input Value: {feat['value']}")
    print("-" * 75 + "\n")


def main():
    parser = argparse.ArgumentParser(description="Test Maharashtra HTE Enrollment ML Model")
    parser.add_argument("--demo", action="store_true", help="Run automated test cases")
    args = parser.parse_args()

    print_banner()

    models_dir = "models"
    if not os.path.exists(models_dir) or not os.path.exists(os.path.join(models_dir, "best_model.pkl")):
        print(f" Trained model files not found in '{models_dir}/'. Training model pipeline first...")
        from ml_pipeline import run_pipeline
        run_pipeline()

    predictor = HTEEnrollmentPredictor(models_dir=models_dir)

    if args.demo:
        run_predefined_scenarios(predictor)
    else:
        print("Choose Testing Mode:")
        print("1. Interactive Custom Input Mode")
        print("2. Run Predefined Benchmark Scenarios")
        choice = input("\nEnter choice (1 or 2) [Default: 1]: ").strip()
        if choice == "2":
            run_predefined_scenarios(predictor)
        else:
            interactive_mode(predictor)


if __name__ == "__main__":
    main()
