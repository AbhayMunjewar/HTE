"""
HTE Decision Intelligence Platform — Utility Helpers
=====================================================
Sanitation and formatting helpers for JSON serialization safety.
"""

import math
import numpy as np

def clean_dict(data):
    """Recursively replaces NaN, inf, -inf with None/0/empty for clean JSON serialization."""
    if isinstance(data, list):
        return [clean_dict(item) for item in data]
    elif isinstance(data, dict):
        cleaned = {}
        for k, v in data.items():
            if isinstance(v, float):
                if math.isnan(v) or math.isinf(v):
                    cleaned[k] = None
                else:
                    cleaned[k] = round(v, 4)
            elif isinstance(v, (dict, list)):
                cleaned[k] = clean_dict(v)
            elif v is np.nan or v is None:
                cleaned[k] = None
            else:
                cleaned[k] = v
        return cleaned
    elif isinstance(data, float):
        if math.isnan(data) or math.isinf(data):
            return None
        return round(data, 4)
    return data

def clean_records(records: list) -> list:
    """Cleans a list of dictionary records."""
    return clean_dict(records)
