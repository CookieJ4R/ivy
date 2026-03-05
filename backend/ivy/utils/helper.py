"""
File containing various helper functions
"""
import random

def generate_random_hex_color() -> str:
    """
    Generate a random hex color code in the format #RRGGBB.
    """
    return "#{:06x}".format(random.randint(0, 0xFFFFFF))
