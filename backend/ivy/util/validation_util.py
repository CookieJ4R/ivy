"""
Various utility functions for validating data.
"""
from typing import TypeVar

from pydantic import BaseModel, ValidationError


T = TypeVar('T', bound=BaseModel)

def validate_tuple_safe(data_tuple: tuple, model_class: type[T]) -> T | None:
    """
    Validates and converts a data tuple into an instance of the specified model class safely.
    Will return None if the data does not match the model structure.
    """
    try:
        return model_class.model_validate(dict(zip(model_class.model_fields.keys(), data_tuple)))
    except ValidationError as e:
        return None


def validate_safe(data: dict, model_class: type[T]) -> T | None:
    """
    Validates and converts a data dictionary into an instance of the specified model class safely.
    Will return None if the data does not match the model structure.
    """
    try:
        return model_class.model_validate(data)
    except ValidationError as e:
        return None
