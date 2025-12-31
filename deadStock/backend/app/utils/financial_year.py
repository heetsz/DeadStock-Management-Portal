from datetime import date
from typing import Optional


def calculate_financial_year(purchase_date: date) -> str:
    """
    Calculate financial year based on purchase date.
    Financial Year: 1 March to 28/29 February
    
    If month >= 3 (March onwards):
        FY = YYYY - (YYYY+1)
    Else (Jan, Feb):
        FY = (YYYY-1) - YYYY
    
    Examples:
        - 15-March-2024 → FY: 2024-2025
        - 20-January-2024 → FY: 2023-2024
    """
    year = purchase_date.year
    month = purchase_date.month
    
    if month >= 3:  # March onwards
        fy_start = year
        fy_end = year + 1
    else:  # January, February
        fy_start = year - 1
        fy_end = year
    
    return f"{fy_start}-{fy_end}"


def get_financial_years_list(start_year: int = 2020) -> list[str]:
    """Get list of financial years from start_year to current"""
    current_year = date.today().year
    years = []
    
    for year in range(start_year, current_year + 2):
        years.append(f"{year}-{year+1}")
    
    return years

