"""
HTE Decision Intelligence Platform — Analytics: Recommendations
================================================================
Rule-based policy recommendation generator based on metric thresholds.
"""

from typing import List, Dict, Any

class AnalyticsRecommendations:
    @staticmethod
    def generate_recommendations(metrics: Dict[str, Any]) -> List[str]:
        recommendations = []

        ratio = metrics.get("student_faculty_ratio", 15.0)
        if ratio > 20.0:
            recommendations.append("Priority Faculty Recruitment: Student-to-faculty ratio ({}:1) exceeds government standard of 15:1. Initiate recruitment drive for core departments.".format(ratio))
        elif ratio > 17.0:
            recommendations.append("Faculty Balance: Student-to-faculty ratio ({}:1) is slightly elevated. Consider adjunct or visiting faculty appointments.".format(ratio))

        placement_rate = metrics.get("placement_rate", 80.0)
        if placement_rate < 60.0:
            recommendations.append("Placement Enhancement Program: Placement rate ({:.1f}%) is below target threshold. Mandate industry internship partnerships and soft-skill workshops.".format(placement_rate))
        elif placement_rate < 75.0:
            recommendations.append("Placement Optimization: Expand campus recruitment drives with tier-1 MNCs and core engineering sectors.")

        naac = str(metrics.get("naac_grade", "B")).upper()
        if naac in ["B", "B+", "C", "UNACCREDITED"]:
            recommendations.append("NAAC Accreditation Upgrade: Form NAAC Quality Advisory Committee to improve academic infrastructure and research output for higher accreditation grade.")

        pub_count = metrics.get("publications", 10)
        if pub_count < 15:
            recommendations.append("Research Incentive Scheme: Institute faculty research seed-funding and publication grants to boost IEEE/Scopus indexing.")

        if not recommendations:
            recommendations.append("Maintain Current Governance: Institutional metrics satisfy state benchmarks. Continue monitoring research and enrollment trends.")

        return recommendations
