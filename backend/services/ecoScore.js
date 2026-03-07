/**
 * EcoScore Calculator
 * Calculates an eco score 0-100 from 6 sustainability dimensions (each 0-20).
 */
function calculateEcoScore(breakdown) {
    const {
        renewable_energy = 0,
        water_conservation = 0,
        waste_management = 0,
        sustainable_materials = 0,
        community_impact = 0,
        carbon_reduction = 0,
    } = breakdown;

    const total =
        renewable_energy +
        water_conservation +
        waste_management +
        sustainable_materials +
        community_impact +
        carbon_reduction;

    // Cap at 100
    return Math.min(100, Math.round(total));
}

/**
 * Returns a label for a given eco score
 */
function ecoScoreLabel(score) {
    if (score >= 85) return 'Platinum';
    if (score >= 70) return 'Gold';
    if (score >= 55) return 'Silver';
    if (score >= 40) return 'Bronze';
    return 'Basic';
}

module.exports = { calculateEcoScore, ecoScoreLabel };
