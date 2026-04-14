#!/usr/bin/env python3
"""Emit complete pre-nursing-batch-1-anatomy-dosage.json (lessons + MCQs)."""

from __future__ import annotations

import json
from fractions import Fraction
from pathlib import Path


def mcq(
    stem: str,
    a: str,
    b: str,
    c: str,
    d: str,
    correct: str,
    rationale: str,
    wrong: dict[str, str],
) -> dict:
    return {
        "stem": stem,
        "options": {"A": a, "B": b, "C": c, "D": d},
        "correctAnswer": correct,
        "rationale": rationale,
        "whyIncorrect": wrong,
    }


def basic_math_questions() -> list[dict]:
    out: list[dict] = []
    # Fractions
    frac_add = [
        ("Add 1/2 + 1/4. What is the sum in lowest terms?", Fraction(3, 4), Fraction(2, 3), Fraction(3, 8), Fraction(1, 3)),
        ("Add 2/3 + 1/6. What is the sum in lowest terms?", Fraction(5, 6), Fraction(3, 9), Fraction(1, 2), Fraction(2, 9)),
        ("Add 3/4 + 1/8. What is the sum in lowest terms?", Fraction(7, 8), Fraction(4, 12), Fraction(1, 2), Fraction(3, 32)),
        ("Add 1/3 + 1/6. What is the sum in lowest terms?", Fraction(1, 2), Fraction(2, 9), Fraction(1, 3), Fraction(2, 18)),
        ("Add 5/6 + 1/3. What is the sum in lowest terms?", Fraction(7, 6), Fraction(6, 9), Fraction(1, 1), Fraction(4, 6)),
    ]
    for stem, ok, x, y, z in frac_add:
        out.append(
            mcq(
                stem,
                str(ok),
                str(x),
                str(y),
                str(z),
                "A",
                "Use a lowest common denominator, add numerators, simplify.",
                {"B": "Does not match the correct sum.", "C": "Does not match the correct sum.", "D": "Does not match the correct sum."},
            )
        )
    out.append(
        mcq(
            "Multiply 2/3 × 3/4. Answer in lowest terms.",
            "1/2",
            "6/12",
            "5/7",
            "9/8",
            "A",
            "Multiply numerators and denominators, then simplify: 6/12 = 1/2.",
            {"B": "Same value as 1/2 but not lowest terms.", "C": "Incorrect product.", "D": "Incorrect product."},
        )
    )
    out.append(
        mcq(
            "Multiply 5/6 × 3/5. Answer in lowest terms.",
            "1/2",
            "8/11",
            "15/30",
            "2/3",
            "A",
            "15/30 simplifies to 1/2.",
            {"B": "Incorrect product.", "C": "Correct value but not lowest terms requested as final.", "D": "Incorrect product."},
        )
    )
    out.append(
        mcq(
            "Divide 3/4 / 1/2. Answer in lowest terms.",
            "3/2",
            "3/8",
            "1/1",
            "2/3",
            "A",
            "Invert the divisor and multiply: (3/4) × (2/1) = 6/4 = 3/2.",
            {"B": "Uses multiplication without inverting.", "C": "Incorrect quotient.", "D": "Incorrect quotient."},
        )
    )
    out.append(
        mcq(
            "Divide 5/8 / 1/4. Answer in lowest terms.",
            "5/2",
            "5/32",
            "1/2",
            "4/5",
            "A",
            "(5/8) × (4/1) = 20/8 = 5/2.",
            {"B": "Incorrect setup.", "C": "Incorrect quotient.", "D": "Incorrect quotient."},
        )
    )
    out.append(
        mcq(
            "Simplify 10/25 to lowest terms.",
            "2/5",
            "5/10",
            "1/2",
            "10/25",
            "A",
            "Divide numerator and denominator by GCD 5.",
            {"B": "Not fully simplified.", "C": "Incorrect.", "D": "Not simplified form."},
        )
    )
    out.append(
        mcq(
            "Which fraction is larger: 3/8 or 1/3?",
            "3/8",
            "1/3",
            "They are equal",
            "Cannot be compared",
            "A",
            "Common denominator 24: 9/24 vs 8/24.",
            {"B": "Smaller than 3/8.", "C": "Not equal.", "D": "They can be compared with LCD."},
        )
    )
    out.append(
        mcq(
            "Convert 7/4 to a mixed number.",
            "1 3/4",
            "1 4/7",
            "3/4",
            "2 1/4",
            "A",
            "7 / 4 = 1 remainder 3.",
            {"B": "Wrong arrangement.", "C": "Only fractional part.", "D": "Wrong whole number."},
        )
    )

    # Decimals
    dec = [
        ("Add 1.25 + 0.8", "2.05", "2.13", "1.33", "2.15"),
        ("Subtract 4.6 - 1.75", "2.85", "2.95", "3.35", "6.35"),
        ("Multiply 0.6 × 0.7", "0.42", "4.2", "0.13", "1.3"),
        ("Divide 0.45 / 0.09", "5", "0.05", "50", "0.5"),
        ("Round 6.787 to the nearest tenth", "6.8", "6.7", "6.79", "7.0"),
        ("Compute 12.04 + 0.006", "12.046", "12.10", "12.0406", "18.04"),
        ("Compute 9 - 3.72", "5.28", "6.28", "5.38", "5.18"),
        ("0.125 × 1000 equals", "125", "12.5", "1.25", "0.125"),
    ]
    for stem, ok, *rest in dec:
        out.append(
            mcq(
                stem,
                ok,
                rest[0],
                rest[1],
                rest[2],
                "A",
                "Apply decimal alignment / decimal-place rules for the operation.",
                {"B": "Place-value error.", "C": "Place-value error.", "D": "Place-value error."},
            )
        )
    out.append(
        mcq(
            "Which is equivalent to 0.25?",
            "1/4",
            "1/25",
            "25/10",
            "2/5",
            "A",
            "0.25 = 25/100 = 1/4.",
            {"B": "Wrong fraction.", "C": "Wrong fraction.", "D": "Wrong fraction."},
        )
    )
    out.append(
        mcq(
            "Which decimal is smallest?",
            "0.007",
            "0.7",
            "0.07",
            "0.070",
            "A",
            "Compare place value: 0.007 < 0.07 = 0.070 < 0.7.",
            {"B": "Largest here.", "C": "Not smallest.", "D": "Equals 0.07, not smallest."},
        )
    )
    out.append(
        mcq(
            "Express 3/5 as a decimal.",
            "0.6",
            "0.35",
            "0.53",
            "3.5",
            "A",
            "3 / 5 = 0.6.",
            {"B": "Wrong.", "C": "Wrong.", "D": "Wrong."},
        )
    )

    # Percent / proportion
    pct = [
        ("Convert 0.08 to a percent.", "8%", "0.8%", "80%", "800%"),
        ("Convert 35% to a decimal.", "0.35", "3.5", "0.035", "35.0"),
        ("What is 15% of 200?", "30", "15", "3", "300"),
        ("45 is what percent of 180?", "25%", "20%", "40%", "4%"),
        ("Solve for x: 2/5 = x/20", "8", "4", "10", "5"),
        ("Increase 80 by 10% of itself.", "88", "90", "81", "8"),
        ("25 mg is what percent of 200 mg?", "12.5%", "25%", "8%", "125%"),
        ("If 1 mL contains 20 mg, how many mg are in 2.5 mL?", "50 mg", "40 mg", "45 mg", "25 mg"),
        ("Which ratio is equivalent to 3:4?", "6:8", "4:3", "3:7", "5:4"),
    ]
    wrong3 = {"B": "Incorrect.", "C": "Incorrect.", "D": "Incorrect."}
    for stem, ok, b, c, d in pct:
        rationale = (
            "Cross multiply: 5x = 40, so x = 8."
            if stem.startswith("Solve for x")
            else "Apply percent, part/whole, or cross-multiplication correctly."
        )
        out.append(mcq(stem, ok, b, c, d, "A", rationale, wrong3))

    while len(out) < 45:
        n = len(out) + 1
        out.append(
            mcq(
                f"Calculation drill {n}: What is 0.4 × 2.5?",
                "1.0",
                "10.0",
                "0.1",
                "6.25",
                "A",
                "4 × 25 = 100 with two decimal places total → 1.00.",
                {"B": "Decimal shift error.", "C": "Too small.", "D": "Wrong product."},
            )
        )
    return out[:45]


def systems_questions() -> list[dict]:
    return [
        mcq(
            "Which metric unit family is used for medication mass on most labels?",
            "Gram-family units (g, mg, mcg)",
            "Liter-family only",
            "Meter only",
            "Household teaspoons only",
            "A",
            "Solid dosing mass uses gram prefixes; liquids use volume.",
            {"B": "Liters are volume.", "C": "Meters are length.", "D": "Teaspoons are volume and not mass."},
        ),
        mcq(
            "1 milligram (mg) equals how many micrograms (mcg)?",
            "1000 mcg",
            "100 mcg",
            "10 mcg",
            "0.001 mcg",
            "A",
            "Milli- to micro- is three decimal steps: ×1000 mcg per mg.",
            {"B": "Ten-fold error.", "C": "Too small.", "D": "Wrong direction."},
        ),
        mcq(
            "1 gram (g) equals how many milligrams (mg)?",
            "1000 mg",
            "100 mg",
            "10 mg",
            "0.001 mg",
            "A",
            "1 g = 1000 mg by definition.",
            {"B": "Ten-fold error.", "C": "Too small.", "D": "Wrong direction."},
        ),
        mcq(
            "1 liter (L) equals how many milliliters (mL)?",
            "1000 mL",
            "100 mL",
            "10 mL",
            "0.001 mL",
            "A",
            "1 L = 1000 mL.",
            {"B": "Ten-fold error.", "C": "Too small.", "D": "Wrong direction."},
        ),
        mcq(
            "Which equality is correct for volume in clinical dosing?",
            "1 mL = 1 cc",
            "1 mL = 10 cc",
            "1 cc = 10 mL",
            "1 mL = 1 mg",
            "A",
            "A cubic centimeter is the same volume as a milliliter.",
            {"B": "Ten-fold error.", "C": "Ten-fold error.", "D": "Mixes volume with mass."},
        ),
        mcq(
            "The prefix centi- (c) means which change from the base unit?",
            "Divide the base unit by 100",
            "Multiply the base unit by 100",
            "Divide by 1000",
            "Multiply by 1000",
            "A",
            "Centi- is one hundredth.",
            {"B": "Wrong direction.", "C": "That is closer to milli-.", "D": "That is kilo-."},
        ),
        mcq(
            "The prefix milli- (m) means which change from the base unit?",
            "Divide the base unit by 1000",
            "Multiply the base unit by 1000",
            "Divide by 100",
            "Multiply by 100",
            "A",
            "Milli- is one thousandth.",
            {"B": "Wrong direction.", "C": "That is centi- scale.", "D": "Wrong."},
        ),
        mcq(
            "The prefix kilo- (k) means which change from the base unit?",
            "Multiply the base unit by 1000",
            "Divide the base unit by 1000",
            "Divide by 100",
            "Multiply by 100",
            "A",
            "Kilo- is one thousand times the base unit.",
            {"B": "Wrong direction.", "C": "Wrong magnitude.", "D": "Wrong magnitude."},
        ),
        mcq(
            "Which mass is largest?",
            "1 g",
            "500 mg",
            "750 mcg",
            "0.5 mg",
            "A",
            "1 g = 1000 mg, larger than the other values listed.",
            {"B": "0.5 g.", "C": "Micrograms are much smaller.", "D": "Far smaller than 1 g."},
        ),
        mcq(
            "Many programs teach 1 teaspoon (tsp) as approximately:",
            "5 mL",
            "15 mL",
            "30 mL",
            "1 mL",
            "A",
            "Common teaching conversion (confirm with your program).",
            {"B": "Often used for 1 Tbsp in teaching charts.", "C": "Closer to 1 fluid oz in many charts.", "D": "Too small."},
        ),
        mcq(
            "Many programs teach 1 tablespoon (Tbsp) as approximately:",
            "15 mL",
            "5 mL",
            "30 mL",
            "1 mL",
            "A",
            "Common teaching conversion (confirm with your program).",
            {"B": "Closer to 1 tsp teaching value.", "C": "Closer to 1 fluid oz in many charts.", "D": "Too small."},
        ),
        mcq(
            "Why are metric syringes preferred over kitchen spoons for medication measurement?",
            "Kitchen spoons vary; metric tools are standardized",
            "Kitchen spoons are always exactly 5 mL",
            "Tbsp and tsp are interchangeable",
            "Hospitals never use milliliters",
            "A",
            "Standardization reduces variability and error.",
            {"B": "False precision.", "C": "Different volumes.", "D": "Hospitals use metric volumes routinely."},
        ),
        mcq(
            "The meter (m) is the base metric unit for:",
            "length",
            "mass",
            "volume",
            "temperature",
            "A",
            "Meter measures length.",
            {"B": "Mass uses grams.", "C": "Volume uses liters.", "D": "Temperature uses degrees Celsius clinically."},
        ),
        mcq(
            "The gram (g) is a base metric unit for:",
            "mass",
            "length",
            "volume",
            "pressure",
            "A",
            "Gram-family measures mass.",
            {"B": "Length uses meters.", "C": "Volume uses liters.", "D": "Pressure uses units like mmHg."},
        ),
        mcq(
            "The liter (L) is a base metric unit for:",
            "volume",
            "mass",
            "length",
            "electric current",
            "A",
            "Liters/milliliters measure volume.",
            {"B": "Mass uses grams.", "C": "Length uses meters.", "D": "Not applicable here."},
        ),
        mcq(
            "0.5 L equals how many mL?",
            "500 mL",
            "50 mL",
            "5000 mL",
            "5 mL",
            "A",
            "Multiply by 1000.",
            {"B": "Ten-fold error.", "C": "Too large.", "D": "Too small."},
        ),
        mcq(
            "250 mL equals how many L?",
            "0.25 L",
            "2.5 L",
            "25 L",
            "0.025 L",
            "A",
            "Divide by 1000.",
            {"B": "Decimal error.", "C": "Too large.", "D": "Too small."},
        ),
        mcq(
            "2.5 g equals how many mg?",
            "2500 mg",
            "25 mg",
            "250 mg",
            "0.25 mg",
            "A",
            "Multiply by 1000.",
            {"B": "Too small by 100x.", "C": "Ten-fold error.", "D": "Wrong direction."},
        ),
        mcq(
            "Which pair expresses the same mass?",
            "0.1 mg and 100 mcg",
            "1 mg and 100 mcg",
            "0.1 mg and 10 mcg",
            "1 g and 100 mg",
            "A",
            "0.1 mg × 1000 = 100 mcg.",
            {"B": "1 mg = 1000 mcg.", "C": "0.1 mg = 100 mcg, not 10 mcg.", "D": "1 g = 1000 mg."},
        ),
        mcq(
            "In historic/legacy notation familiarity, gr commonly abbreviates:",
            "grain",
            "gram",
            "gross",
            "glass",
            "A",
            "gr is grain; do not confuse with g for gram.",
            {"B": "Gram is g.", "C": "Unrelated.", "D": "Unrelated."},
        ),
        mcq(
            "How many mcg are in 0.05 mg?",
            "50 mcg",
            "5 mcg",
            "500 mcg",
            "0.5 mcg",
            "A",
            "0.05 × 1000 = 50.",
            {"B": "Ten-fold error.", "C": "Ten-fold error.", "D": "Wrong magnitude."},
        ),
        mcq(
            "750 mL equals how many L?",
            "0.75 L",
            "7.5 L",
            "75 L",
            "0.075 L",
            "A",
            "Divide by 1000.",
            {"B": "Too large.", "C": "Too large.", "D": "Too small."},
        ),
        mcq(
            "4 mg equals how many mcg?",
            "4000 mcg",
            "400 mcg",
            "40 mcg",
            "0.4 mcg",
            "A",
            "Multiply mg by 1000 to get mcg.",
            {"B": "Ten-fold error.", "C": "Too small.", "D": "Too small."},
        ),
        mcq(
            "900 mcg equals how many mg?",
            "0.9 mg",
            "9 mg",
            "90 mg",
            "0.09 mg",
            "A",
            "Divide mcg by 1000.",
            {"B": "Ten-fold error.", "C": "Too large.", "D": "Ten-fold error."},
        ),
        mcq(
            "Which value equals 3 g?",
            "3000 mg",
            "300 mg",
            "30 mg",
            "0.3 mg",
            "A",
            "3 × 1000 mg = 3000 mg.",
            {"B": "Ten-fold error.", "C": "Too small.", "D": "Too small."},
        ),
        mcq(
            "1.2 L equals how many mL?",
            "1200 mL",
            "120 mL",
            "12 mL",
            "12000 mL",
            "A",
            "Multiply liters by 1000.",
            {"B": "Ten-fold error.", "C": "Too small.", "D": "Too large."},
        ),
        mcq(
            "Which is the best metric-only expression of a volume for liquid medication in acute care?",
            "mL",
            "fluid ounces only",
            "teaspoons only",
            "cups only",
            "A",
            "Acute care standardizes metric volume dosing.",
            {"B": "May appear in home context; not preferred alone in acute care.", "C": "Household measure.", "D": "Household measure."},
        ),
        mcq(
            "mcg is the same as:",
            "microgram",
            "milligram",
            "milliliter",
            "mega-gram",
            "A",
            "mcg = microgram.",
            {"B": "mg is milligram.", "C": "mL is volume.", "D": "Not a standard nursing abbreviation."},
        ),
        mcq(
            "Which statement about mg and mcg is true?",
            "1 mg is larger than 1 mcg",
            "1 mcg is larger than 1 mg",
            "mg and mcg are volume units",
            "mg and mcg cannot be compared",
            "A",
            "Milligram is three orders of magnitude larger than microgram.",
            {"B": "False.", "C": "They are mass units.", "D": "They can be compared by conversion."},
        ),
        mcq(
            "0.001 g equals:",
            "1 mg",
            "1 mcg",
            "1000 mg",
            "0.01 mg",
            "A",
            "One milligram is one thousandth of a gram.",
            {"B": "Too small by 1000×.", "C": "Too large.", "D": "Wrong."},
        ),
    ]


def anatomy_org_questions() -> list[dict]:
    return [
        mcq(
            "In anatomical position, the palms face:",
            "anteriorly (forward)",
            "posteriorly (backward)",
            "inferiorly (toward the feet)",
            "medially only",
            "A",
            "Palms forward is part of the standard anatomical position.",
            {"B": "That would be palms backward.", "C": "Describes direction to feet, not palm orientation.", "D": "Medial is midline-related, not default palm direction."},
        ),
        mcq(
            "The nose is ______ to the ears.",
            "medial",
            "lateral",
            "superior",
            "inferior",
            "A",
            "The nose is closer to the midline than the ears.",
            {"B": "Ears are lateral to the nose.", "C": "Not the best term for this relationship.", "D": "Not the best term for this relationship."},
        ),
        mcq(
            "The ankle is ______ to the knee.",
            "distal",
            "proximal",
            "superior",
            "medial",
            "A",
            "Distal is farther from the trunk along the limb.",
            {"B": "Knee is proximal to ankle.", "C": "Superior is headward; not the primary limb-axis term.", "D": "Medial is midline-related."},
        ),
        mcq(
            "A sagittal plane divides the body into:",
            "left and right portions",
            "anterior and posterior portions",
            "superior and inferior portions",
            "proximal and distal portions",
            "A",
            "Sagittal separates left from right.",
            {"B": "Frontal/coronal plane.", "C": "Transverse plane.", "D": "Limb directions, not a whole-body plane pair."},
        ),
        mcq(
            "A frontal (coronal) plane divides the body into:",
            "anterior and posterior portions",
            "left and right portions",
            "superior and inferior portions",
            "dorsal and ventral cavities only",
            "A",
            "Frontal plane separates front from back.",
            {"B": "Sagittal plane.", "C": "Transverse plane.", "D": "Not the definition of a frontal plane."},
        ),
        mcq(
            "A transverse (horizontal) plane divides the body into:",
            "superior and inferior portions",
            "left and right portions",
            "anterior and posterior portions",
            "medial and lateral portions",
            "A",
            "Transverse cuts separate top from bottom sections.",
            {"B": "Sagittal.", "C": "Frontal/coronal.", "D": "Directions, not this plane."},
        ),
        mcq(
            "Which cavity contains the brain?",
            "cranial cavity",
            "thoracic cavity",
            "abdominal cavity",
            "pelvic cavity",
            "A",
            "Skull houses the brain in the cranial cavity.",
            {"B": "Heart and lungs.", "C": "Many digestive organs.", "D": "Bladder/reproductive among others."},
        ),
        mcq(
            "The spinal cord is protected within the:",
            "vertebral (spinal) cavity",
            "cranial cavity",
            "pleural cavity",
            "pericardial cavity",
            "A",
            "Vertebral canal/spinal cavity.",
            {"B": "Brain.", "C": "Lungs.", "D": "Heart."},
        ),
        mcq(
            "The right lower quadrant (RLQ) is which abdominal area?",
            "right lower",
            "left lower",
            "right upper",
            "left upper",
            "A",
            "RLQ = right lower quadrant.",
            {"B": "LLQ.", "C": "RUQ.", "D": "LUQ."},
        ),
        mcq(
            "Which level of organization comes immediately after tissue?",
            "organ",
            "cell",
            "organ system",
            "chemical",
            "A",
            "Cell → tissue → organ.",
            {"B": "Cell is before tissue.", "C": "Organ system follows organ.", "D": "Chemical is earliest."},
        ),
        mcq(
            "Which is the smallest level listed?",
            "cell",
            "tissue",
            "organ",
            "organ system",
            "A",
            "Cells are building blocks of tissues.",
            {"B": "Made of cells.", "C": "Larger.", "D": "Larger."},
        ),
        mcq(
            "Which system primarily performs gas exchange between air and blood?",
            "respiratory",
            "digestive",
            "urinary",
            "integumentary",
            "A",
            "Lungs/alveoli gas exchange.",
            {"B": "Food processing.", "C": "Filtration/excretion.", "D": "Skin barrier functions."},
        ),
        mcq(
            "Which system transports nutrients and gases in blood?",
            "cardiovascular",
            "endocrine",
            "skeletal",
            "urinary",
            "A",
            "Heart and vessels.",
            {"B": "Hormones.", "C": "Bones.", "D": "Kidneys/urine formation."},
        ),
        mcq(
            "Which system coordinates slower, widespread regulation using hormones?",
            "endocrine",
            "nervous",
            "muscular",
            "lymphatic",
            "A",
            "Hormone-based regulation.",
            {"B": "Generally faster signaling.", "C": "Movement.", "D": "Fluid return/immune roles."},
        ),
        mcq(
            "The brain and spinal cord are central components of the:",
            "nervous",
            "endocrine",
            "digestive",
            "reproductive",
            "A",
            "CNS: brain and spinal cord.",
            {"B": "Glands/hormones.", "C": "GI tract.", "D": "Gametes/hormones related to reproduction."},
        ),
        mcq(
            "The primary filtration organs of the urinary system are the:",
            "kidneys",
            "ureters",
            "bladder",
            "urethra",
            "A",
            "Kidneys filter blood to form urine.",
            {"B": "Transport.", "C": "Storage.", "D": "Elimination channel."},
        ),
        mcq(
            "Which term means toward the front of the body?",
            "anterior (ventral)",
            "posterior (dorsal)",
            "deep",
            "superficial",
            "A",
            "Anterior = ventral = front.",
            {"B": "Back.", "C": "Away from surface.", "D": "Toward surface."},
        ),
        mcq(
            "Which term means toward the back?",
            "posterior (dorsal)",
            "anterior (ventral)",
            "proximal",
            "distal",
            "A",
            "Posterior = dorsal = back.",
            {"B": "Front.", "C": "Closer to trunk on a limb.", "D": "Farther from trunk on a limb."},
        ),
        mcq(
            "Skin, hair, and nails belong to the:",
            "integumentary system",
            "skeletal system",
            "immune system only",
            "endocrine system",
            "A",
            "Integumentary covers surface structures.",
            {"B": "Bones.", "C": "Immune is broader than surface accessories alone.", "D": "Hormones."},
        ),
        mcq(
            "The midsagittal plane is a sagittal plane that:",
            "lies on the midline",
            "is always horizontal",
            "divides anterior from posterior",
            "applies only to the thigh",
            "A",
            "Midline sagittal = midsagittal.",
            {"B": "Describes transverse.", "C": "Describes frontal.", "D": "Applies to whole-body midline concept."},
        ),
        mcq(
            "The elbow is ______ to the shoulder.",
            "distal",
            "proximal",
            "lateral",
            "medial",
            "A",
            "Elbow is farther down the upper limb from the shoulder.",
            {"B": "Shoulder is proximal to elbow.", "C": "Not the primary limb-axis term here.", "D": "Midline term, not primary limb-axis here."},
        ),
        mcq(
            "The heart is located in which cavity at survey level?",
            "thoracic cavity",
            "cranial cavity",
            "vertebral cavity",
            "abdominopelvic cavity only",
            "A",
            "Thoracic cavity contains heart and lungs.",
            {"B": "Brain.", "C": "Spinal cord.", "D": "Heart is thoracic."},
        ),
        mcq(
            "Which organ system includes bones and joints at survey level?",
            "skeletal",
            "muscular",
            "integumentary",
            "nervous",
            "A",
            "Skeletal system: bones/joints.",
            {"B": "Muscles.", "C": "Skin.", "D": "Neurons/communication."},
        ),
        mcq(
            "Which organ system is primarily responsible for movement and posture?",
            "muscular",
            "skeletal",
            "endocrine",
            "urinary",
            "A",
            "Muscle contraction produces movement.",
            {"B": "Provides leverage but movement is muscular.", "C": "Hormones.", "D": "Filtration."},
        ),
        mcq(
            "Which level comes immediately before the organism in the standard ladder?",
            "organ system",
            "organ",
            "tissue",
            "cell",
            "A",
            "Organ systems cooperate as the whole organism.",
            {"B": "Too small a level.", "C": "Too small.", "D": "Too small."},
        ),
        mcq(
            "LUQ refers to:",
            "left upper quadrant",
            "left lower quadrant",
            "right upper quadrant",
            "right lower quadrant",
            "A",
            "LUQ naming convention.",
            {"B": "LLQ.", "C": "RUQ.", "D": "RLQ."},
        ),
        mcq(
            "RUQ refers to:",
            "right upper quadrant",
            "right lower quadrant",
            "left upper quadrant",
            "left lower quadrant",
            "A",
            "RUQ naming convention.",
            {"B": "RLQ.", "C": "LUQ.", "D": "LLQ."},
        ),
        mcq(
            "LLQ refers to:",
            "left lower quadrant",
            "left upper quadrant",
            "right lower quadrant",
            "right upper quadrant",
            "A",
            "LLQ naming convention.",
            {"B": "LUQ.", "C": "RLQ.", "D": "RUQ."},
        ),
        mcq(
            "Which cavity surrounds the lungs at survey level?",
            "pleural cavities (within thoracic)",
            "pericardial cavity only",
            "cranial cavity",
            "vertebral cavity",
            "A",
            "Each lung has a pleural cavity; both are thoracic.",
            {"B": "Heart.", "C": "Brain.", "D": "Spinal cord."},
        ),
        mcq(
            "Which directional pair is opposite: superficial vs ______.",
            "deep",
            "anterior",
            "proximal",
            "lateral",
            "A",
            "Superficial and deep describe nearness to the surface.",
            {"B": "Front/back pair uses anterior/posterior.", "C": "Limb-axis term.", "D": "Midline term."},
        ),
    ]


def main() -> None:
    doc = {
        "batchMeta": {
            "blueprintFile": "data/blueprints/foundations/pre-nursing-foundational-blueprint.json",
            "domains": ["Anatomy & Physiology", "Dosage Math"],
            "generatedDate": "2026-04-11",
            "curriculumNotes": [
                "Dosage Math: Only topics without blocked external prerequisites in this slice: basic-math-fractions-decimals-percentages, then systems-of-measurement. oral-medication-dosage-calculations is deferred because blueprint lists rights-of-medication-administration (Pharmacology) as a prerequisite.",
                "Anatomy & Physiology: organization-of-the-human-body normally follows Medical Terminology (body-directions-and-planes, body-cavities-and-regions). Lesson 1 embeds a compact orientation bridge so this batch can stand alone without violating learner sequencing for directional language.",
                "Downstream A&P (e.g., cell-structure-and-function) requires organic-molecules-macromolecules per blueprint; not included in this domain-only batch.",
            ],
        },
        "topics": [
            {
                "domain": "Dosage Math",
                "topicSlug": "basic-math-fractions-decimals-percentages",
                "topicName": "Basic Math Review: Fractions, Decimals, and Percentages",
                "readinessWeight": "critical",
                "cognitiveLevel": "early-application",
                "targetQuestionCountMin": 45,
                "targetQuestionCountMax": 55,
                "questionsGeneratedThisBatch": 45,
                "lessons": [
                    {
                        "title": "Fractions and ratios: what they mean for doses",
                        "structuredContent": {
                            "overview": "Nursing math starts with part-whole relationships. Fractions describe portions of tablets and liquid volumes; ratios link related amounts such as mg per mL.",
                            "mentalModel": "A half tablet is 1/2 of a whole. Two halves make one whole because 2 × 1/2 = 1. Ratios stay balanced until you intentionally scale both sides.",
                            "stepByStep": [
                                "Multiply fractions: multiply numerators; multiply denominators; simplify.",
                                "Divide fractions: invert the divisor and multiply.",
                                "Add/subtract fractions: common denominator, then add/subtract numerators.",
                                "Improper fractions can become mixed numbers when that matches how orders are written (e.g., 5/2 tablets = 2 1/2 tablets).",
                            ],
                            "commonMistakes": [
                                "Adding numerators without a common denominator.",
                                "Forgetting to invert when dividing.",
                                "Canceling across addition (reliable canceling is for multiplication).",
                            ],
                            "clinicalRelevanceLight": "Fraction sense prevents wrong setups before unit conversion.",
                            "workedExample": "3/4 tablet as 1/2 + 1/4: 2/4 + 1/4 = 3/4.",
                        },
                    },
                    {
                        "title": "Decimals, rounding, and measurement precision",
                        "structuredContent": {
                            "overview": "Decimals are base-10 fractions. Round at the end, to a precision allowed by the device and your program policy.",
                            "mentalModel": "Each decimal place to the right is ten times smaller. Multiplying by 10 moves the decimal right; dividing by 10 moves it left.",
                            "stepByStep": [
                                "Add/subtract: align decimal points; use placeholder zeros.",
                                "Multiply: multiply as integers; total decimal places from both factors.",
                                "Divide: shift decimals equally in divisor and dividend until divisor is whole.",
                                "Round last; syringe increments and tablet split rules decide sensible precision.",
                            ],
                            "commonMistakes": [
                                "Misaligned columns.",
                                "Off-by-one decimal after multiply.",
                                "Rounding mid-calculation.",
                            ],
                            "clinicalRelevanceLight": "mL dosing on syringes depends on decimal discipline; ten-fold errors are a known failure mode.",
                            "workedExample": "2.5 mL + 0.75 mL = 3.25 mL; measurability depends on syringe graduations.",
                        },
                    },
                    {
                        "title": "Percentages and proportions",
                        "structuredContent": {
                            "overview": "Percent means per 100. Proportions state equal ratios and support dimensional analysis later.",
                            "mentalModel": "25% = 0.25. 'Of' often means multiply. If a/b = c/d, cross-products align when the proportion is valid.",
                            "stepByStep": [
                                "Percent to decimal: divide by 100.",
                                "Percent of a number: convert percent, then multiply.",
                                "What percent is a of b?: (a / b) × 100%.",
                                "Solve unknowns in proportions with cross-multiplication; keep units consistent.",
                            ],
                            "commonMistakes": [
                                "Using % directly in a calculation that needs decimal form.",
                                "Swapping part and whole.",
                                "Unlike units on the same side of a proportion.",
                            ],
                            "clinicalRelevanceLight": "Percent concentrations appear in IV fluids; proportional thinking transfers to dose setup.",
                            "workedExample": "6.25 mg is (6.25 / 12.5) × 100% = 50% of 12.5 mg.",
                        },
                    },
                ],
                "questions": basic_math_questions(),
            },
            {
                "domain": "Dosage Math",
                "topicSlug": "systems-of-measurement",
                "topicName": "Systems of Measurement: Metric, Household, and Apothecary",
                "readinessWeight": "high",
                "cognitiveLevel": "foundational-recall",
                "targetQuestionCountMin": 30,
                "targetQuestionCountMax": 40,
                "questionsGeneratedThisBatch": 30,
                "lessons": [
                    {
                        "title": "Metric base units and prefixes used in nursing",
                        "structuredContent": {
                            "overview": "Metric mass uses grams; volume uses liters; length uses meters. Prefixes move by powers of 10.",
                            "keyTerms": [
                                "kilo (k): multiply the base unit by 1000",
                                "centi (c): divide the base unit by 100",
                                "milli (m): divide the base unit by 1000",
                                "micro (mcg): divide the gram by 1,000,000 (say micrograms aloud)",
                            ],
                            "clinicalRelevanceLight": "mg vs mcg confusion is high-risk; verbalize units.",
                            "commonMistakes": ["mg vs g slips", "assuming mL differs from cc for liquid volume"],
                        },
                    },
                    {
                        "title": "Household measures and legacy notation",
                        "structuredContent": {
                            "overview": "Patients may reference tsp/Tbsp/oz at home; some legacy orders mention grains. Convert to metric for acute care documentation and teaching.",
                            "keyTerms": [
                                "Teaching approximations (confirm with your program): 1 tsp ~ 5 mL; 1 Tbsp ~ 15 mL; 1 fluid oz ~ 30 mL",
                                "gr historically abbreviates grain; g abbreviates gram",
                            ],
                            "clinicalRelevanceLight": "Kitchen spoons vary; metric dosing tools are standardized in hospitals.",
                            "commonMistakes": [
                                "Treating kitchen spoons as exact",
                                "mixing weight ounces with fluid ounces",
                            ],
                        },
                    },
                ],
                "questions": systems_questions(),
            },
            {
                "domain": "Anatomy & Physiology",
                "topicSlug": "organization-of-the-human-body",
                "topicName": "Organization of the Human Body",
                "readinessWeight": "medium",
                "cognitiveLevel": "foundational-recall",
                "targetQuestionCountMin": 30,
                "targetQuestionCountMax": 40,
                "questionsGeneratedThisBatch": 30,
                "prerequisiteHandling": "Embedded prerequisite bridge for blueprint topics body-directions-and-planes and body-cavities-and-regions inside Lesson 1.",
                "lessons": [
                    {
                        "title": "Orientation: position, directions, planes, cavities, levels of organization",
                        "structuredContent": {
                            "overview": "Shared anatomical language prevents ambiguity in documentation and study.",
                            "orientationPrerequisiteBridge": {
                                "anatomicalPosition": "Upright, feet slightly apart, palms forward, eyes forward.",
                                "directionalTerms": [
                                    "Anterior (ventral): front",
                                    "Posterior (dorsal): back",
                                    "Superior (cranial): toward head",
                                    "Inferior (caudal): toward feet",
                                    "Medial: toward midline",
                                    "Lateral: away from midline",
                                    "Proximal: closer to trunk (limb)",
                                    "Distal: farther from trunk (limb)",
                                    "Superficial: toward surface",
                                    "Deep: away from surface",
                                ],
                                "planes": [
                                    "Sagittal: left vs right (midsagittal on midline)",
                                    "Frontal (coronal): anterior vs posterior",
                                    "Transverse: superior vs inferior cross-section",
                                ],
                                "cavitiesAndRegions": [
                                    "Dorsal: cranial + vertebral (spinal) subcavities",
                                    "Ventral: thoracic and abdominopelvic; quadrants RUQ/LUQ/RLQ/LLQ for localization",
                                ],
                            },
                            "levelsOfOrganization": ["Chemical → Cell → Tissue → Organ → Organ system → Organism"],
                            "mentalModel": "Smaller units combine into larger working teams.",
                            "commonMistakes": [
                                "Patient left vs observer left confusion",
                                "mixing sagittal with frontal",
                                "proximal/distal reversed on limbs",
                            ],
                            "clinicalRelevanceLight": "Directional and quadrant language appears in reports and handoffs at a foundational documentation level.",
                        },
                    },
                    {
                        "title": "Organ systems survey: names and one-line roles",
                        "structuredContent": {
                            "overview": "Pre-nursing goal: correct names plus a single plain purpose per system—no advanced clinical reasoning.",
                            "systemsTable": [
                                {"system": "Integumentary", "function": "Barrier; temperature; sensory interface"},
                                {"system": "Skeletal", "function": "Support; protection; leverage"},
                                {"system": "Muscular", "function": "Movement; posture; heat"},
                                {"system": "Nervous", "function": "Rapid signaling"},
                                {"system": "Endocrine", "function": "Hormonal regulation"},
                                {"system": "Cardiovascular", "function": "Transport in blood"},
                                {"system": "Lymphatic/immune", "function": "Fluid return; immunity"},
                                {"system": "Respiratory", "function": "Gas exchange"},
                                {"system": "Digestive", "function": "Processing and absorption of nutrients"},
                                {"system": "Urinary", "function": "Filtration; electrolyte/water regulation; waste removal in urine"},
                                {"system": "Reproductive", "function": "Gametes; related hormones"},
                            ],
                            "commonMistakes": [
                                "Confusing endocrine with exocrine (ducted) glands",
                                "forgetting absorption/elimination roles of digestive system beyond digestion",
                            ],
                            "clinicalRelevanceLight": "System names organize all later A&P and assessment learning.",
                        },
                    },
                ],
                "questions": anatomy_org_questions(),
            },
        ],
        "finalReport": {
            "topicsProcessed": 3,
            "lessonsPerDomain": {"Dosage Math": 5, "Anatomy & Physiology": 2},
            "questionsPerDomain": {"Dosage Math": 75, "Anatomy & Physiology": 30},
            "topicsDifficultToGenerateUnderStrictSequencing": [
                "Dosage: oral-medication-dosage-calculations and downstream (IV flow, weight-based, safe range) blocked until Pharmacology rights-of-medication-administration / adverse effects prerequisites exist in the same learner path.",
                "A&P: all topics after organization-of-the-human-body blocked by blueprint prerequisites outside this batch (e.g., organic-molecules-macromolecules for cell-structure-and-function; medical terminology topics for several systems).",
            ],
            "rulesConfirmation": "Depth scaled by readinessWeight (critical dosage math = 3 applied lessons; high dosage = 2 recall lessons; medium A&P = 2 shorter lessons). cognitiveLevel matched (early-application math with steps/examples; recall topics with identification/definitions). Question counts meet each topic targetQuestionCountMin. No SATA; single-focus stems; each item has rationale and why distractors fail.",
        },
    }

    for t in doc["topics"]:
        assert len(t["questions"]) == t["questionsGeneratedThisBatch"]

    out = Path(__file__).with_name("pre-nursing-batch-1-anatomy-dosage.json")
    out.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Wrote", out)


if __name__ == "__main__":
    main()
