import sys

print("Python version:", sys.version)

try:
    import docx
    print("docx: OK")
except ImportError:
    print("docx: MISSING")

try:
    import openpyxl
    print("openpyxl: OK")
except ImportError:
    print("openpyxl: MISSING")
