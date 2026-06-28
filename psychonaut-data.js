/*
 * psychonaut-data.js - Overrides quantitatifs sourcés via l'API PsychonautWiki.
 * Généré côté build/deploiement : aucun appel réseau n'est fait dans le navigateur.
 * Les valeurs restent des repères de réduction des risques, pas des recommandations.
 */
(function (global) {
    "use strict";

    var OVERRIDES = {
    "benzodiazepines": {
        "omit_quantitative_tables": true
    },
    "opioides": {
        "omit_quantitative_tables": true
    },
    "cathinones": {
        "omit_quantitative_tables": true
    },
    "cannabis_synthese": {
        "omit_quantitative_tables": true
    },
    "fentanyl_nitazenes": {
        "omit_quantitative_tables": true
    },
    "mescaline": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Mescaline",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Mescaline",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "50 mg",
                "light": "50 - 200 mg",
                "common": "200 - 400 mg",
                "strong": "400 - 800 mg",
                "heavy": "800 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "50 mg",
            "light": "50 - 200 mg",
            "common": "200 - 400 mg",
            "strong": "400 - 800 mg",
            "heavy": "800 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "45 - 90 min",
                "comeup": "60 - 120 min",
                "peak": "4 - 6 h",
                "offset": "2 - 3 h",
                "total": "8 - 14 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 4050,
                "comeup": 5400,
                "peak": 18000,
                "offset": 9000,
                "total": 39600
            }
        }
    },
    "1p_lsd": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "1P-LSD",
        "psychonaut_url": "https://psychonautwiki.org/wiki/1P-LSD",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "µg",
                "threshold": "15 µg",
                "light": "25 - 75 µg",
                "common": "75 - 150 µg",
                "strong": "150 - 300 µg",
                "heavy": "300 µg +"
            }
        },
        "dosages": {
            "unit": "µg",
            "threshold": "15 µg",
            "light": "25 - 75 µg",
            "common": "75 - 150 µg",
            "strong": "150 - 300 µg",
            "heavy": "300 µg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 60 min",
                "comeup": "45 - 120 min",
                "peak": "3 - 5 h",
                "offset": "3 - 5 h",
                "total": "8 - 12 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2400,
                "comeup": 4950,
                "peak": 14400,
                "offset": 14400,
                "total": 36000
            }
        }
    },
    "2c_i": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "2C-I",
        "psychonaut_url": "https://psychonautwiki.org/wiki/2C-I",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "2 mg",
                "light": "5 - 10 mg",
                "common": "10 - 20 mg",
                "strong": "20 - 30 mg",
                "heavy": "30 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "2 mg",
            "light": "5 - 10 mg",
            "common": "10 - 20 mg",
            "strong": "20 - 30 mg",
            "heavy": "30 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 45 min",
                "comeup": "45 - 90 min",
                "peak": "3 - 5 h",
                "offset": "2 - 3 h",
                "total": "6 - 10 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 4050,
                "peak": 14400,
                "offset": 9000,
                "total": 28800
            }
        }
    },
    "2c_e": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "2C-E",
        "psychonaut_url": "https://psychonautwiki.org/wiki/2C-E",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "2 mg",
                "light": "5 - 10 mg",
                "common": "10 - 15 mg",
                "strong": "15 - 30 mg",
                "heavy": "30 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "1 - 4 mg",
                "common": "4 - 7 mg",
                "strong": "7 - 14 mg",
                "heavy": "14 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "2 mg",
            "light": "5 - 10 mg",
            "common": "10 - 15 mg",
            "strong": "15 - 30 mg",
            "heavy": "30 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 45 min",
                "comeup": "1 - 2 h",
                "peak": "3 - 5 h",
                "offset": "2 - 3 h",
                "total": "6 - 10 h"
            },
            "Insufflé": {
                "onset": "1 - 2 min",
                "comeup": "≈ 16 min",
                "peak": "2 - 4 h",
                "offset": "1 - 2 h",
                "total": "≈ 4 h 47 min"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 5400,
                "peak": 14400,
                "offset": 9000,
                "total": 28800
            },
            "Insufflé": {
                "onset": 90,
                "comeup": 945,
                "peak": 10800,
                "offset": 5400,
                "total": 17235
            }
        }
    },
    "4_aco_dmt": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "4-AcO-DMT",
        "psychonaut_url": "https://psychonautwiki.org/wiki/4-AcO-DMT",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "7,5 - 15 mg",
                "common": "15 - 25 mg",
                "strong": "25 - 45 mg",
                "heavy": "45 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 15 mg",
                "common": "15 - 25 mg",
                "strong": "25 - 50 mg",
                "heavy": "50 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "5 mg",
            "light": "7,5 - 15 mg",
            "common": "15 - 25 mg",
            "strong": "25 - 45 mg",
            "heavy": "45 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 40 min",
                "comeup": "30 - 75 min",
                "peak": "2 - 3,5 h",
                "offset": "1 - 2 h",
                "total": "4 - 7 h"
            },
            "Insufflé": {
                "onset": "5 - 25 min",
                "comeup": "30 - 60 min",
                "peak": "1,5 - 2,5 h",
                "offset": "1 - 1,5 h",
                "total": "3 - 5 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1650,
                "comeup": 3150,
                "peak": 9900,
                "offset": 5400,
                "total": 19800
            },
            "Insufflé": {
                "onset": 900,
                "comeup": 2700,
                "peak": 7200,
                "offset": 4500,
                "total": 14400
            }
        }
    },
    "mda": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "MDA",
        "psychonaut_url": "https://psychonautwiki.org/wiki/MDA",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "20 mg",
                "light": "40 - 60 mg",
                "common": "60 - 100 mg",
                "strong": "100 - 145 mg",
                "heavy": "145 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "20 mg",
            "light": "40 - 60 mg",
            "common": "60 - 100 mg",
            "strong": "100 - 145 mg",
            "heavy": "145 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 90 min",
                "comeup": "15 - 45 min",
                "peak": "2,5 - 4 h",
                "offset": "2 - 3 h",
                "total": "5 - 8 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 3600,
                "comeup": 1800,
                "peak": 11700,
                "offset": 9000,
                "total": 23400
            }
        }
    },
    "mephedrone": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Mephedrone",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Mephedrone",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "15 mg",
                "light": "50 - 100 mg",
                "common": "100 - 200 mg",
                "strong": "200 - 300 mg",
                "heavy": "300 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "15 - 45 mg",
                "common": "45 - 80 mg",
                "strong": "80 - 125 mg",
                "heavy": "125 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "15 mg",
            "light": "50 - 100 mg",
            "common": "100 - 200 mg",
            "strong": "200 - 300 mg",
            "heavy": "300 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 45 min",
                "comeup": "15 - 30 min",
                "peak": "2 - 4 h",
                "offset": "45 - 90 min",
                "total": "3 - 6 h"
            },
            "Insufflé": {
                "onset": "5 - 8 min",
                "comeup": "15 - 30 min",
                "peak": "45 - 60 min",
                "offset": "30 - 90 min",
                "total": "1,5 - 3 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 1350,
                "peak": 10800,
                "offset": 4050,
                "total": 16200
            },
            "Insufflé": {
                "onset": 390,
                "comeup": 1350,
                "peak": 3150,
                "offset": 3600,
                "total": 8100
            }
        }
    },
    "methylphenidate": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Methylphenidate",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Methylphenidate",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 20 mg",
                "common": "20 - 40 mg",
                "strong": "40 - 60 mg",
                "heavy": "60 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "2 - 10 mg",
                "common": "10 - 30 mg",
                "strong": "30 - 60 mg",
                "heavy": "60 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "5 mg",
            "light": "10 - 20 mg",
            "common": "20 - 40 mg",
            "strong": "40 - 60 mg",
            "heavy": "60 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 60 min",
                "comeup": "20 - 45 min",
                "peak": "60 - 90 min",
                "offset": "45 - 60 min",
                "total": "2,5 - 4 h"
            },
            "Insufflé": {
                "onset": "5 - 20 min",
                "comeup": "15 - 40 min",
                "peak": "30 - 45 min",
                "offset": "2 - 4 h",
                "total": "2 - 4 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2700,
                "comeup": 1950,
                "peak": 4500,
                "offset": 3150,
                "total": 11700
            },
            "Insufflé": {
                "onset": 750,
                "comeup": 1650,
                "peak": 2250,
                "offset": 10800,
                "total": 10800
            }
        }
    },
    "modafinil": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Modafinil",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Modafinil",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "25 mg",
                "light": "50 - 100 mg",
                "common": "100 - 200 mg",
                "strong": "200 - 300 mg",
                "heavy": "300 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "25 mg",
            "light": "50 - 100 mg",
            "common": "100 - 200 mg",
            "strong": "200 - 300 mg",
            "heavy": "300 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 60 min",
                "comeup": "20 - 60 min",
                "peak": "3,5 - 5 h",
                "offset": "1 - 3 h",
                "total": "5 - 10 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2400,
                "comeup": 2400,
                "peak": 15300,
                "offset": 7200,
                "total": 27000
            }
        }
    },
    "dxm": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Dextromethorphan",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Dextromethorphan",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "75 mg",
                "light": "100 - 200 mg",
                "common": "200 - 400 mg",
                "strong": "400 - 700 mg",
                "heavy": "700 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "75 mg",
            "light": "100 - 200 mg",
            "common": "200 - 400 mg",
            "strong": "400 - 700 mg",
            "heavy": "700 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 120 min",
                "comeup": "60 - 120 min",
                "peak": "3 - 6 h",
                "offset": "2 - 4 h",
                "total": "8 - 12 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 4500,
                "comeup": 5400,
                "peak": 16200,
                "offset": 10800,
                "total": 36000
            }
        }
    },
    "kratom": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Kratom",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Kratom",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "g",
                "threshold": "1 g",
                "light": "2 - 3 g",
                "common": "3 - 5 g",
                "strong": "5 - 8 g",
                "heavy": "8 g +"
            }
        },
        "dosages": {
            "unit": "g",
            "threshold": "1 g",
            "light": "2 - 3 g",
            "common": "3 - 5 g",
            "strong": "5 - 8 g",
            "heavy": "8 g +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 40 min",
                "comeup": "≈ 30 min",
                "peak": "1 - 2 h",
                "offset": "3 - 6 h",
                "total": "2 - 4 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 1800,
                "peak": 5400,
                "offset": 16200,
                "total": 10800
            }
        }
    },
    "codeine": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Codeine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Codeine",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "30 mg",
                "light": "50 - 100 mg",
                "common": "100 - 150 mg",
                "strong": "150 - 200 mg",
                "heavy": "200 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "30 mg",
            "light": "50 - 100 mg",
            "common": "100 - 150 mg",
            "strong": "150 - 200 mg",
            "heavy": "200 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 45 min",
                "comeup": "1 - 2 h",
                "peak": "3 - 5 h",
                "offset": "2 - 4 h",
                "total": "3 - 6 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2250,
                "comeup": 5400,
                "peak": 14400,
                "offset": 10800,
                "total": 16200
            }
        }
    },
    "cannabis": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Cannabis",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Cannabis",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "2,5 - 5 mg",
                "common": "5 - 10 mg",
                "strong": "10 - 25 mg",
                "heavy": "25 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "0,4 mg",
                "light": "0,4 - 2 mg",
                "common": "2 - 4 mg",
                "strong": "4 - 10 mg",
                "heavy": "10 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "1 mg",
            "light": "2,5 - 5 mg",
            "common": "5 - 10 mg",
            "strong": "10 - 25 mg",
            "heavy": "25 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 60 min",
                "comeup": "30 - 60 min",
                "peak": "1 - 2 h",
                "offset": "4 - 6 h",
                "total": "4 - 10 h"
            },
            "Sublingual": {
                "onset": "1 - 10 min",
                "comeup": "15 - 30 min",
                "peak": "30 - 60 min",
                "offset": "4 - 6 h",
                "total": "3 - 7 h"
            },
            "Inhalé": {
                "onset": "0,1 - 10 min",
                "comeup": "5 - 10 min",
                "peak": "15 - 45 min",
                "offset": "3 - 4 h",
                "total": "2,5 - 5 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2400,
                "comeup": 2700,
                "peak": 5400,
                "offset": 18000,
                "total": 25200
            },
            "Sublingual": {
                "onset": 330,
                "comeup": 1350,
                "peak": 2700,
                "offset": 18000,
                "total": 18000
            },
            "Inhalé": {
                "onset": 303,
                "comeup": 450,
                "peak": 1800,
                "offset": 12600,
                "total": 13500
            }
        }
    },
    "alcool": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Alcohol",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Alcohol",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "g",
                "threshold": "10 g",
                "light": "10 - 20 g",
                "common": "20 - 30 g",
                "strong": "30 - 40 g",
                "heavy": "40 g +"
            }
        },
        "dosages": {
            "unit": "g",
            "threshold": "10 g",
            "light": "10 - 20 g",
            "common": "20 - 30 g",
            "strong": "30 - 40 g",
            "heavy": "40 g +"
        },
        "durations": {
            "Oral": {
                "onset": "2 - 5 min",
                "comeup": "15 - 45 min",
                "peak": "30 - 90 min",
                "offset": "45 - 120 min",
                "total": "1,5 - 5 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 210,
                "comeup": 1800,
                "peak": 3600,
                "offset": 4950,
                "total": 11700
            }
        }
    },
    "mdma": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "MDMA",
        "psychonaut_url": "https://psychonautwiki.org/wiki/MDMA",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "20 mg",
                "light": "20 - 80 mg",
                "common": "80 - 120 mg",
                "strong": "120 - 150 mg",
                "heavy": "150 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "20 mg",
            "light": "20 - 80 mg",
            "common": "80 - 120 mg",
            "strong": "120 - 150 mg",
            "heavy": "150 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 45 min",
                "comeup": "15 - 30 min",
                "peak": "1,5 - 2,5 h",
                "offset": "1 - 1,5 h",
                "total": "3 - 6 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2250,
                "comeup": 1350,
                "peak": 7200,
                "offset": 4500,
                "total": 16200
            }
        }
    },
    "lsd": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "LSD",
        "psychonaut_url": "https://psychonautwiki.org/wiki/LSD",
        "primary_route": "Sublingual",
        "dosages_by_route": {
            "Sublingual": {
                "unit": "µg",
                "threshold": "15 µg",
                "light": "15 - 75 µg",
                "common": "75 - 150 µg",
                "strong": "150 - 300 µg",
                "heavy": "300 µg +"
            }
        },
        "dosages": {
            "unit": "µg",
            "threshold": "15 µg",
            "light": "15 - 75 µg",
            "common": "75 - 150 µg",
            "strong": "150 - 300 µg",
            "heavy": "300 µg +"
        },
        "durations": {
            "Sublingual": {
                "onset": "15 - 30 min",
                "comeup": "45 - 90 min",
                "peak": "3 - 5 h",
                "offset": "3 - 5 h",
                "total": "8 - 12 h"
            }
        },
        "durations_seconds": {
            "Sublingual": {
                "onset": 1350,
                "comeup": 4050,
                "peak": 14400,
                "offset": 14400,
                "total": 36000
            }
        },
        "bioavailability_by_route": {
            "Sublingual": {
                "value": "71 %",
                "source": "PsychonautWiki API"
            }
        }
    },
    "champignons": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Psilocybin mushrooms",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Psilocybin%20mushrooms",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "2,5 mg",
                "light": "2,5 - 10 mg",
                "common": "10 - 25 mg",
                "strong": "25 - 50 mg",
                "heavy": "50 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "2,5 mg",
            "light": "2,5 - 10 mg",
            "common": "10 - 25 mg",
            "strong": "25 - 50 mg",
            "heavy": "50 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 45 min",
                "comeup": "1 - 1,5 h",
                "peak": "2 - 2,5 h",
                "offset": "2,5 - 3,5 h",
                "total": "6 - 8 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1950,
                "comeup": 4500,
                "peak": 8100,
                "offset": 10800,
                "total": 25200
            }
        }
    },
    "ketamine": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Ketamine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Ketamine",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "50 mg",
                "light": "50 - 100 mg",
                "common": "100 - 300 mg",
                "strong": "300 - 450 mg",
                "heavy": "450 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 30 mg",
                "common": "30 - 75 mg",
                "strong": "75 - 150 mg",
                "heavy": "150 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "50 mg",
            "light": "50 - 100 mg",
            "common": "100 - 300 mg",
            "strong": "300 - 450 mg",
            "heavy": "450 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "10 - 30 min",
                "comeup": "5 - 20 min",
                "peak": "45 - 90 min",
                "offset": "3 - 6 h",
                "total": "≈ 6 h 10 min"
            },
            "Insufflé": {
                "onset": "1 - 3 min",
                "comeup": "5 - 15 min",
                "peak": "15 - 45 min",
                "offset": "30 - 60 min",
                "total": "1 - 2 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1200,
                "comeup": 750,
                "peak": 4050,
                "offset": 16200,
                "total": 22200
            },
            "Insufflé": {
                "onset": 120,
                "comeup": 600,
                "peak": 1800,
                "offset": 2700,
                "total": 5400
            }
        },
        "bioavailability_by_route": {
            "Oral": {
                "value": "0 - 17 %",
                "source": "PsychonautWiki API"
            },
            "Insufflé": {
                "value": "0 - 45 %",
                "source": "PsychonautWiki API"
            },
            "Sublingual": {
                "value": "20 - 29 %",
                "source": "PsychonautWiki API"
            }
        }
    },
    "amphetamine": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Amphetamine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Amphetamine",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "2,5 mg",
                "light": "5 - 10 mg",
                "common": "10 - 25 mg",
                "strong": "25 - 50 mg",
                "heavy": "50 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "4 mg",
                "light": "6 - 15 mg",
                "common": "15 - 30 mg",
                "strong": "30 - 50 mg",
                "heavy": "50 mg +"
            },
            "Intraveineux": {
                "unit": "mg",
                "threshold": "4 mg",
                "light": "6 - 15 mg",
                "common": "15 - 30 mg",
                "strong": "30 - 50 mg",
                "heavy": "50 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "2,5 mg",
            "light": "5 - 10 mg",
            "common": "10 - 25 mg",
            "strong": "25 - 50 mg",
            "heavy": "50 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 45 min",
                "comeup": "30 - 135 min",
                "peak": "2,5 - 4 h",
                "offset": "2 - 3 h",
                "total": "6 - 8 h"
            },
            "Insufflé": {
                "onset": "1 - 5 min",
                "comeup": "30 - 90 min",
                "peak": "1 - 2 h",
                "offset": "1,5 - 3 h",
                "total": "3 - 6 h"
            },
            "Intraveineux": {
                "onset": "2 - 10 s",
                "comeup": "2 - 10 s",
                "peak": "2 - 4 h",
                "offset": "1 - 2 h",
                "total": "3 - 6 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2250,
                "comeup": 4950,
                "peak": 11700,
                "offset": 9000,
                "total": 25200
            },
            "Insufflé": {
                "onset": 180,
                "comeup": 3600,
                "peak": 5400,
                "offset": 8100,
                "total": 16200
            },
            "Intraveineux": {
                "onset": 6,
                "comeup": 6,
                "peak": 10800,
                "offset": 5400,
                "total": 16200
            }
        }
    },
    "methamphetamine": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Methamphetamine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Methamphetamine",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "5 - 10 mg",
                "common": "10 - 25 mg",
                "strong": "25 - 50 mg",
                "heavy": "50 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "5 - 10 mg",
                "common": "10 - 30 mg",
                "strong": "30 - 60 mg",
                "heavy": "60 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "5 - 10 mg",
                "common": "10 - 20 mg",
                "strong": "20 - 60 mg",
                "heavy": "60 mg +"
            },
            "Rectal": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "5 - 10 mg",
                "common": "10 - 30 mg",
                "strong": "30 - 40 mg",
                "heavy": "40 mg +"
            },
            "Intraveineux": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "5 - 10 mg",
                "common": "10 - 30 mg",
                "strong": "30 - 40 mg",
                "heavy": "40 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "5 mg",
            "light": "5 - 10 mg",
            "common": "10 - 25 mg",
            "strong": "25 - 50 mg",
            "heavy": "50 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 45 min",
                "comeup": "1 - 3 h",
                "peak": "3 - 5 h",
                "offset": "3 - 4 h",
                "total": "8 - 12 h"
            },
            "Insufflé": {
                "onset": "3 - 5 min",
                "comeup": "3 - 5 min",
                "peak": "1,5 - 3 h",
                "offset": "2 - 4 h",
                "total": "4 - 7 h"
            },
            "Inhalé": {
                "onset": "7 - 10 s",
                "comeup": "5 - 10 s",
                "peak": "1 - 3 h",
                "offset": "1 - 3 h",
                "total": "2 - 6 h"
            },
            "Rectal": {
                "onset": "5 - 15 min",
                "comeup": "3 - 5 min",
                "peak": "2 - 4 h",
                "offset": "3 - 5 h",
                "total": "6 - 10 h"
            },
            "Intraveineux": {
                "onset": "15 - 30 s",
                "comeup": "1 - 2 min",
                "peak": "1 - 3 h",
                "offset": "3 - 4 h",
                "total": "4 - 8 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 7200,
                "peak": 14400,
                "offset": 12600,
                "total": 36000
            },
            "Insufflé": {
                "onset": 240,
                "comeup": 240,
                "peak": 8100,
                "offset": 10800,
                "total": 19800
            },
            "Inhalé": {
                "onset": 9,
                "comeup": 8,
                "peak": 7200,
                "offset": 7200,
                "total": 14400
            },
            "Rectal": {
                "onset": 600,
                "comeup": 240,
                "peak": 10800,
                "offset": 14400,
                "total": 28800
            },
            "Intraveineux": {
                "onset": 23,
                "comeup": 90,
                "peak": 7200,
                "offset": 12600,
                "total": 21600
            }
        }
    },
    "cocaine": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Cocaine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Cocaine",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "13 mg",
                "light": "13 - 75 mg",
                "common": "75 - 150 mg",
                "strong": "150 - 225 mg",
                "heavy": "225 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 30 mg",
                "common": "30 - 60 mg",
                "strong": "60 - 90 mg",
                "heavy": "90 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "2,5 mg",
                "light": "5 - 15 mg",
                "common": "15 - 30 mg",
                "strong": "30 - 45 mg",
                "heavy": "45 mg +"
            },
            "Intraveineux": {
                "unit": "mg",
                "threshold": "2 mg",
                "light": "2 - 5 mg",
                "common": "5 - 10 mg",
                "strong": "10 - 15 mg",
                "heavy": "15 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "13 mg",
            "light": "13 - 75 mg",
            "common": "75 - 150 mg",
            "strong": "150 - 225 mg",
            "heavy": "225 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 40 min",
                "comeup": "40 - 50 min",
                "peak": "60 - 180 min",
                "offset": "10 - 25 min",
                "total": "120 - 240 min"
            },
            "Insufflé": {
                "onset": "3 - 10 min",
                "comeup": "5 - 12 min",
                "peak": "7,5 - 16 min",
                "offset": "10 - 25 min",
                "total": "10 - 90 min"
            },
            "Inhalé": {
                "onset": "3 - 5 s",
                "comeup": "1 - 2 min",
                "peak": "2 - 10 min",
                "offset": "1 - 5 min",
                "total": "5 - 15 min"
            },
            "Rectal": {
                "onset": "3 - 5 min",
                "comeup": "5 - 15 min",
                "peak": "10 - 30 min",
                "offset": "30 - 45 min",
                "total": "45 - 90 min (descente résiduelle : 1 - 4 h)"
            },
            "Intraveineux": {
                "onset": "3 - 5 s",
                "comeup": "1 - 2 min",
                "peak": "2 - 10 min",
                "offset": "1 - 5 min",
                "total": "5 - 15 min"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2100,
                "comeup": 2700,
                "peak": 7200,
                "offset": 1050,
                "total": 10800
            },
            "Insufflé": {
                "onset": 390,
                "comeup": 510,
                "peak": 705,
                "offset": 1050,
                "total": 3000
            },
            "Inhalé": {
                "onset": 4,
                "comeup": 90,
                "peak": 360,
                "offset": 180,
                "total": 600
            },
            "Rectal": {
                "onset": 240,
                "comeup": 600,
                "peak": 1200,
                "offset": 2250,
                "total": 4050
            },
            "Intraveineux": {
                "onset": 4,
                "comeup": 90,
                "peak": 360,
                "offset": 180,
                "total": 600
            }
        }
    },
    "2cb": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "2C-B",
        "psychonaut_url": "https://psychonautwiki.org/wiki/2C-B",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 15 mg",
                "common": "15 - 25 mg",
                "strong": "25 - 45 mg",
                "heavy": "45 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "5 - 8 mg",
                "common": "8 - 12 mg",
                "strong": "12 - 23 mg",
                "heavy": "23 mg +"
            },
            "Rectal": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "5 - 8 mg",
                "common": "8 - 12 mg",
                "strong": "12 - 23 mg",
                "heavy": "23 mg +"
            },
            "Intraveineux": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "1 - 2,5 mg",
                "common": "2,5 - 5 mg",
                "strong": "5 - 10 mg",
                "heavy": "10 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "5 mg",
            "light": "10 - 15 mg",
            "common": "15 - 25 mg",
            "strong": "25 - 45 mg",
            "heavy": "45 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 40 min",
                "comeup": "60 - 90 min",
                "peak": "60 - 90 min",
                "offset": "2,5 - 3,5 h",
                "total": "5 - 7 h"
            },
            "Insufflé": {
                "onset": "1 - 5 min",
                "comeup": "15 - 30 min",
                "peak": "60 - 90 min",
                "offset": "2 - 3 h",
                "total": "4 - 6 h"
            },
            "Rectal": {
                "onset": "0 - 20 min",
                "comeup": "≈ 20 min",
                "peak": "≈ 3 h",
                "offset": "≈ 1 h 30 min",
                "total": "4 - 7 h"
            },
            "Intraveineux": {
                "onset": "5 - 15 s",
                "comeup": "≈ 30 s",
                "peak": "15 - 30 min",
                "offset": "1,5 - 2 h",
                "total": "2 - 3 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 4500,
                "peak": 4500,
                "offset": 10800,
                "total": 21600
            },
            "Insufflé": {
                "onset": 180,
                "comeup": 1350,
                "peak": 4500,
                "offset": 9000,
                "total": 18000
            },
            "Rectal": {
                "onset": 600,
                "comeup": 1200,
                "peak": 10800,
                "offset": 5400,
                "total": 19800
            },
            "Intraveineux": {
                "onset": 10,
                "comeup": 30,
                "peak": 1350,
                "offset": 6300,
                "total": 9000
            }
        }
    },
    "salvia": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Salvinorin A",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Salvinorin%20A",
        "primary_route": "Inhalé",
        "dosages_by_route": {
            "Sublingual": {
                "unit": "feuilles / extrait",
                "threshold": "Non renseigné",
                "light": "Non renseigné",
                "common": "Non renseigné",
                "strong": "Non renseigné",
                "heavy": "Non renseigné"
            },
            "Inhalé": {
                "unit": "extrait",
                "threshold": "feuille brute",
                "light": "extrait 5x",
                "common": "extrait 10x",
                "strong": "extrait 20x",
                "heavy": "extrait 40x +"
            }
        },
        "bioavailability_by_route": {
            "Sublingual": {
                "value": "Non quantifiée",
                "source": "PsychonautWiki API"
            },
            "Inhalé": {
                "value": "Non quantifiée",
                "source": "PsychonautWiki API"
            }
        },
        "durations": {
            "Sublingual": {
                "onset": "10 - 20 min",
                "comeup": "Non quantifiée",
                "peak": "Non quantifiée",
                "offset": "Non quantifiée",
                "total": "30 - 90 min"
            },
            "Inhalé": {
                "onset": "15 - 60 s",
                "comeup": "Non quantifiée",
                "peak": "Non quantifiée",
                "offset": "Non quantifiée",
                "total": "15 - 90 min"
            }
        },
        "durations_seconds": {
            "Sublingual": {
                "onset": 900,
                "comeup": 1,
                "peak": 1,
                "offset": 1,
                "total": 3600
            },
            "Inhalé": {
                "onset": 38,
                "comeup": 1,
                "peak": 1,
                "offset": 1,
                "total": 3150
            }
        }
    },
    "dmt": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "DMT",
        "psychonaut_url": "https://psychonautwiki.org/wiki/DMT",
        "primary_route": "Inhalé",
        "dosages_by_route": {
            "Inhalé": {
                "unit": "mg",
                "threshold": "2 mg",
                "light": "10 - 20 mg",
                "common": "20 - 40 mg",
                "strong": "40 - 60 mg",
                "heavy": "60 mg +"
            },
            "Intraveineux": {
                "unit": "mg",
                "threshold": "4 mg",
                "light": "4 - 10 mg",
                "common": "10 - 15 mg",
                "strong": "15 - 20 mg",
                "heavy": "20 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "2 mg",
            "light": "10 - 20 mg",
            "common": "20 - 40 mg",
            "strong": "40 - 60 mg",
            "heavy": "60 mg +"
        },
        "bioavailability_by_route": {
            "Inhalé": {
                "value": "Non quantifiée",
                "source": "PsychonautWiki API"
            },
            "Intraveineux": {
                "value": "100 % (par définition)",
                "source": "PsychonautWiki API"
            }
        },
        "durations": {
            "Inhalé": {
                "onset": "20 - 40 s",
                "comeup": "1 - 3 min",
                "peak": "2 - 8 min",
                "offset": "1 - 6 min",
                "total": "5 - 20 min"
            },
            "Intraveineux": {
                "onset": "2 - 10 s",
                "comeup": "70 - 100 s",
                "peak": "2 - 5 min",
                "offset": "10 - 20 min",
                "total": "15 - 30 min"
            }
        },
        "durations_seconds": {
            "Inhalé": {
                "onset": 30,
                "comeup": 120,
                "peak": 300,
                "offset": 210,
                "total": 750
            },
            "Intraveineux": {
                "onset": 6,
                "comeup": 85,
                "peak": 210,
                "offset": 900,
                "total": 1350
            }
        }
    },
    "tramadol": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Tramadol",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Tramadol",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "25 mg",
                "light": "25 - 100 mg",
                "common": "100 - 250 mg",
                "strong": "250 - 300 mg",
                "heavy": "300 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "25 mg",
            "light": "25 - 100 mg",
            "common": "100 - 250 mg",
            "strong": "250 - 300 mg",
            "heavy": "300 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 60 min",
                "comeup": "30 - 60 min",
                "peak": "2 - 6 h",
                "offset": "2 - 4 h",
                "total": "6 - 10 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2250,
                "comeup": 2700,
                "peak": 14400,
                "offset": 10800,
                "total": 28800
            }
        },
        "bioavailability_by_route": {
            "Oral": {
                "value": "70 - 90 %",
                "source": "PsychonautWiki API"
            }
        }
    },
    "ghb": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "GHB",
        "psychonaut_url": "https://psychonautwiki.org/wiki/GHB",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "g",
                "threshold": "0,5 g",
                "light": "0,5 - 1 g",
                "common": "1 - 2,5 g",
                "strong": "2,5 - 4 g",
                "heavy": "4 g +"
            }
        },
        "dosages": {
            "unit": "g",
            "threshold": "0,5 g",
            "light": "0,5 - 1 g",
            "common": "1 - 2,5 g",
            "strong": "2,5 - 4 g",
            "heavy": "4 g +"
        },
        "durations": {
            "Oral": {
                "onset": "5 - 30 min",
                "comeup": "10 - 20 min",
                "peak": "45 - 90 min",
                "offset": "15 - 30 min",
                "total": "1,5 - 2,5 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1050,
                "comeup": 900,
                "peak": 4050,
                "offset": 1350,
                "total": 7200
            }
        }
    },
    "protoxyde_azote": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Nitrous",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Nitrous",
        "primary_route": "Inhalé",
        "dosages_by_route": {
            "Inhalé": {
                "unit": "g",
                "threshold": "4 g",
                "light": "4 - 8 g",
                "common": "8 - 16 g",
                "strong": "16 - 40 g",
                "heavy": "40 g +"
            }
        },
        "dosages": {
            "unit": "g",
            "threshold": "4 g",
            "light": "4 - 8 g",
            "common": "8 - 16 g",
            "strong": "16 - 40 g",
            "heavy": "40 g +"
        },
        "durations": {
            "Inhalé": {
                "onset": "5 - 10 s",
                "comeup": "5 - 10 s",
                "peak": "15 - 30 s",
                "offset": "1 - 5 min",
                "total": "1 - 5 min"
            }
        },
        "durations_seconds": {
            "Inhalé": {
                "onset": 8,
                "comeup": 8,
                "peak": 23,
                "offset": 180,
                "total": 180
            }
        }
    },
    "cafeine": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Caffeine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Caffeine",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "10 mg",
                "light": "20 - 50 mg",
                "common": "50 - 150 mg",
                "strong": "150 - 500 mg",
                "heavy": "500 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "2,5 mg",
                "light": "10 - 25 mg",
                "common": "25 - 40 mg",
                "strong": "40 - 80 mg",
                "heavy": "80 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "25 mg",
                "light": "25 - 75 mg",
                "common": "75 - 125 mg",
                "strong": "125 - 175 mg",
                "heavy": "175 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "10 mg",
            "light": "20 - 50 mg",
            "common": "50 - 150 mg",
            "strong": "150 - 500 mg",
            "heavy": "500 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "5 - 10 min",
                "comeup": "10 - 60 min",
                "peak": "1 - 2 h",
                "offset": "6 - 10 h",
                "total": "2 - 5 h"
            },
            "Insufflé": {
                "onset": "0,5 - 2 min",
                "comeup": "0,5 - 2 min",
                "peak": "0,5 - 1 h",
                "offset": "6 - 10 h",
                "total": "1 - 2,5 h"
            },
            "Inhalé": {
                "onset": "2 - 5 min",
                "comeup": "≈ 2 min",
                "peak": "10 - 20 min",
                "offset": "30 - 45 min",
                "total": "45 - 70 min"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 450,
                "comeup": 2100,
                "peak": 5400,
                "offset": 28800,
                "total": 12600
            },
            "Insufflé": {
                "onset": 75,
                "comeup": 75,
                "peak": 2700,
                "offset": 28800,
                "total": 6300
            },
            "Inhalé": {
                "onset": 210,
                "comeup": 144,
                "peak": 900,
                "offset": 2250,
                "total": 3450
            }
        }
    },
    "doc": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "DOC",
        "psychonaut_url": "https://psychonautwiki.org/wiki/DOC",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "0,5 mg",
                "light": "1 - 2 mg",
                "common": "2 - 4 mg",
                "strong": "4 - 6 mg",
                "heavy": "6 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "0,25 mg",
                "light": "0,25 - 1 mg",
                "common": "1 - 2 mg",
                "strong": "2 - 3,5 mg",
                "heavy": "3,5 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "0,5 mg",
            "light": "1 - 2 mg",
            "common": "2 - 4 mg",
            "strong": "4 - 6 mg",
            "heavy": "6 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "1 - 2 h",
                "comeup": "2 - 3 h",
                "peak": "6 - 12 h",
                "offset": "2 - 8 h",
                "total": "12 - 24 h"
            },
            "Insufflé": {
                "onset": "1 - 5 min",
                "comeup": "10 - 30 min",
                "peak": "2 - 6 h",
                "offset": "2 - 8 h",
                "total": "≈ 9 h 23 min"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 5400,
                "comeup": 9000,
                "peak": 32400,
                "offset": 18000,
                "total": 64800
            },
            "Insufflé": {
                "onset": 180,
                "comeup": 1200,
                "peak": 14400,
                "offset": 18000,
                "total": 33780
            }
        }
    },
    "nbome_25i": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "25I-NBOMe",
        "psychonaut_url": "https://psychonautwiki.org/wiki/25I-NBOMe",
        "primary_route": "Sublingual",
        "dosages_by_route": {
            "Sublingual": {
                "unit": "µg",
                "threshold": "50 µg",
                "light": "200 - 500 µg",
                "common": "500 - 700 µg",
                "strong": "700 - 1000 µg",
                "heavy": "1000 µg +"
            },
            "Insufflé": {
                "unit": "µg",
                "threshold": "50 µg",
                "light": "200 - 500 µg",
                "common": "500 - 700 µg",
                "strong": "700 µg +",
                "heavy": "700 µg +"
            }
        },
        "dosages": {
            "unit": "µg",
            "threshold": "50 µg",
            "light": "200 - 500 µg",
            "common": "500 - 700 µg",
            "strong": "700 - 1000 µg",
            "heavy": "1000 µg +"
        },
        "durations": {
            "Sublingual": {
                "onset": "15 - 120 min",
                "comeup": "30 - 120 min",
                "peak": "2 - 4 h",
                "offset": "1 - 4 h",
                "total": "6 - 10 h"
            },
            "Insufflé": {
                "onset": "5 - 10 min",
                "comeup": "10 - 30 min",
                "peak": "60 - 120 min",
                "offset": "120 - 180 min",
                "total": "4 - 6 h"
            }
        },
        "durations_seconds": {
            "Sublingual": {
                "onset": 4050,
                "comeup": 4500,
                "peak": 10800,
                "offset": 9000,
                "total": 28800
            },
            "Insufflé": {
                "onset": 450,
                "comeup": 1200,
                "peak": 5400,
                "offset": 9000,
                "total": 18000
            }
        }
    },
    "mxe": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Methoxetamine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Methoxetamine",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 25 mg",
                "common": "25 - 45 mg",
                "strong": "45 - 70 mg",
                "heavy": "70 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 20 mg",
                "common": "20 - 35 mg",
                "strong": "35 - 60 mg",
                "heavy": "60 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "5 mg",
            "light": "10 - 25 mg",
            "common": "25 - 45 mg",
            "strong": "45 - 70 mg",
            "heavy": "70 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 30 min",
                "comeup": "45 - 90 min",
                "peak": "1,5 - 2,5 h",
                "offset": "1 - 1,5 h",
                "total": "4 - 6 h"
            },
            "Insufflé": {
                "onset": "5 - 20 min",
                "comeup": "30 - 75 min",
                "peak": "1 - 2 h",
                "offset": "1 - 1,5 h",
                "total": "3 - 5 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1350,
                "comeup": 4050,
                "peak": 7200,
                "offset": 4500,
                "total": 18000
            },
            "Insufflé": {
                "onset": 750,
                "comeup": 3150,
                "peak": 5400,
                "offset": 4500,
                "total": 14400
            }
        }
    },
    "3_meo_pcp": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "3-MeO-PCP",
        "psychonaut_url": "https://psychonautwiki.org/wiki/3-MeO-PCP",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "2 mg",
                "light": "4 - 8 mg",
                "common": "8 - 15 mg",
                "strong": "15 - 25 mg",
                "heavy": "25 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "2 - 5 mg",
                "common": "5 - 10 mg",
                "strong": "10 - 15 mg",
                "heavy": "15 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "2 mg",
                "light": "5 - 10 mg",
                "common": "10 - 20 mg",
                "strong": "20 - 25 mg",
                "heavy": "25 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "2 mg",
            "light": "4 - 8 mg",
            "common": "8 - 15 mg",
            "strong": "15 - 25 mg",
            "heavy": "25 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 90 min",
                "comeup": "45 - 120 min",
                "peak": "2 - 3 h",
                "offset": "1 - 2 h",
                "total": "4 - 8 h"
            },
            "Insufflé": {
                "onset": "5 - 30 min",
                "comeup": "45 - 90 min",
                "peak": "1,5 - 2 h",
                "offset": "45 - 60 min",
                "total": "3 - 5 h"
            },
            "Inhalé": {
                "onset": "≈ 2 min",
                "comeup": "≈ 5 min",
                "peak": "≈ 63 min",
                "offset": "≈ 81 min",
                "total": "45 - 120 min"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 3600,
                "comeup": 4950,
                "peak": 9000,
                "offset": 5400,
                "total": 21600
            },
            "Insufflé": {
                "onset": 1050,
                "comeup": 4050,
                "peak": 6300,
                "offset": 3150,
                "total": 14400
            },
            "Inhalé": {
                "onset": 96,
                "comeup": 288,
                "peak": 3780,
                "offset": 4860,
                "total": 4950
            }
        }
    },
    "mdpv": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "MDPV",
        "psychonaut_url": "https://psychonautwiki.org/wiki/MDPV",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "2 mg",
                "light": "4 - 8 mg",
                "common": "8 - 14 mg",
                "strong": "14 - 25 mg",
                "heavy": "25 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "2 mg",
            "light": "4 - 8 mg",
            "common": "8 - 14 mg",
            "strong": "14 - 25 mg",
            "heavy": "25 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 30 min",
                "comeup": "≈ 23 min",
                "peak": "1 - 4 h",
                "offset": "0,5 - 2 h",
                "total": "2 - 7 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1350,
                "comeup": 1350,
                "peak": 9000,
                "offset": 4500,
                "total": 16200
            }
        }
    },
    "heroine": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Heroin",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Heroin",
        "primary_route": "Insufflé",
        "dosages_by_route": {
            "Insufflé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "7,5 - 20 mg",
                "common": "20 - 35 mg",
                "strong": "35 - 50 mg",
                "heavy": "50 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "2 mg",
                "light": "5 - 15 mg",
                "common": "15 - 25 mg",
                "strong": "25 - 50 mg",
                "heavy": "50 mg +"
            },
            "Intraveineux": {
                "unit": "mg",
                "threshold": "Non renseigné",
                "light": "Non renseigné",
                "common": "5 - 8 mg",
                "strong": "8 - 15 mg",
                "heavy": "15 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "5 mg",
            "light": "7,5 - 20 mg",
            "common": "20 - 35 mg",
            "strong": "35 - 50 mg",
            "heavy": "50 mg +"
        },
        "durations": {
            "Insufflé": {
                "onset": "10 - 60 s",
                "comeup": "10 - 60 s",
                "peak": "1 - 90 min",
                "offset": "1 - 3 h",
                "total": "3 - 7 h"
            },
            "Inhalé": {
                "onset": "5 - 10 s",
                "comeup": "5 - 10 s",
                "peak": "15 - 30 min",
                "offset": "15 - 30 min",
                "total": "3 - 5 h"
            },
            "Intraveineux": {
                "onset": "0 - 5 s",
                "comeup": "0 - 5 s",
                "peak": "1 - 4 h",
                "offset": "30 - 60 min",
                "total": "4 - 5 h"
            }
        },
        "durations_seconds": {
            "Insufflé": {
                "onset": 35,
                "comeup": 35,
                "peak": 2730,
                "offset": 7200,
                "total": 18000
            },
            "Inhalé": {
                "onset": 8,
                "comeup": 8,
                "peak": 1350,
                "offset": 1350,
                "total": 14400
            },
            "Intraveineux": {
                "onset": 3,
                "comeup": 3,
                "peak": 9000,
                "offset": 2700,
                "total": 16200
            }
        }
    },
    "oxycodone": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Oxycodone",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Oxycodone",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "2,5 - 10 mg",
                "common": "10 - 25 mg",
                "strong": "25 - 40 mg",
                "heavy": "40 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "2,5 - 7,5 mg",
                "common": "7,5 - 15 mg",
                "strong": "15 - 25 mg",
                "heavy": "25 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "1,5 - 8 mg",
                "common": "8 - 20 mg",
                "strong": "20 - 35 mg",
                "heavy": "30 mg +"
            },
            "Intraveineux": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "2,5 - 5 mg",
                "common": "7,5 - 10 mg",
                "strong": "12,5 - 15 mg",
                "heavy": "15 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "1 mg",
            "light": "2,5 - 10 mg",
            "common": "10 - 25 mg",
            "strong": "25 - 40 mg",
            "heavy": "40 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "10 - 30 min",
                "comeup": "60 - 120 min",
                "peak": "1 - 2 h",
                "offset": "0 - 2 h",
                "total": "4 - 8 h"
            },
            "Insufflé": {
                "onset": "2 - 7 min",
                "comeup": "20 - 40 min",
                "peak": "1,5 - 4 h",
                "offset": "45 - 120 min",
                "total": "3 - 5 h"
            },
            "Inhalé": {
                "onset": "≈ 1 min",
                "comeup": "≈ 4 min",
                "peak": "≈ 32 min",
                "offset": "≈ 81 min",
                "total": "1 - 3 h"
            },
            "Intraveineux": {
                "onset": "0 - 1 min",
                "comeup": "≈ 2 min",
                "peak": "3 - 5 h",
                "offset": "≈ 81 min",
                "total": "3 - 5 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1200,
                "comeup": 5400,
                "peak": 5400,
                "offset": 3600,
                "total": 21600
            },
            "Insufflé": {
                "onset": 270,
                "comeup": 1800,
                "peak": 9900,
                "offset": 4950,
                "total": 14400
            },
            "Inhalé": {
                "onset": 72,
                "comeup": 216,
                "peak": 1890,
                "offset": 4860,
                "total": 7200
            },
            "Intraveineux": {
                "onset": 30,
                "comeup": 108,
                "peak": 14400,
                "offset": 4860,
                "total": 14400
            }
        }
    },
    "phenibut": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Phenibut",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Phenibut",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "g",
                "threshold": "0,25 g",
                "light": "0,5 - 1 g",
                "common": "1 - 2 g",
                "strong": "2 - 3,5 g",
                "heavy": "3,5 g +"
            }
        },
        "dosages": {
            "unit": "g",
            "threshold": "0,25 g",
            "light": "0,5 - 1 g",
            "common": "1 - 2 g",
            "strong": "2 - 3,5 g",
            "heavy": "3,5 g +"
        },
        "durations": {
            "Oral": {
                "onset": "1,5 - 3 h",
                "comeup": "1,5 - 3 h",
                "peak": "3 - 4 h",
                "offset": "4 - 6 h",
                "total": "10 - 16 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 8100,
                "comeup": 8100,
                "peak": 12600,
                "offset": 18000,
                "total": 46800
            }
        }
    },
    "pregabaline": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Pregabalin",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Pregabalin",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "50 mg",
                "light": "50 - 225 mg",
                "common": "225 - 600 mg",
                "strong": "600 - 900 mg",
                "heavy": "900 mg +"
            },
            "Rectal": {
                "unit": "mg",
                "threshold": "40 mg",
                "light": "40 - 200 mg",
                "common": "200 - 450 mg",
                "strong": "450 - 600 mg",
                "heavy": "600 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "50 mg",
            "light": "50 - 225 mg",
            "common": "225 - 600 mg",
            "strong": "600 - 900 mg",
            "heavy": "900 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 45 min",
                "comeup": "1 - 2 h",
                "peak": "4 - 6 h",
                "offset": "4 - 8 h",
                "total": "9 - 17 h"
            },
            "Rectal": {
                "onset": "15 - 30 min",
                "comeup": "30 - 120 min",
                "peak": "2 - 3 h",
                "offset": "3 - 5 h",
                "total": "5 - 8 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2250,
                "comeup": 5400,
                "peak": 18000,
                "offset": 21600,
                "total": 46800
            },
            "Rectal": {
                "onset": 1350,
                "comeup": 4500,
                "peak": 9000,
                "offset": 14400,
                "total": 23400
            }
        },
        "bioavailability_by_route": {
            "Oral": {
                "value": "0 - 90 %",
                "source": "PsychonautWiki API"
            }
        }
    },
    "ald_52": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "ALD-52",
        "psychonaut_url": "https://psychonautwiki.org/wiki/ALD-52",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "µg",
                "threshold": "30 µg",
                "light": "30 - 100 µg",
                "common": "100 - 175 µg",
                "strong": "175 - 325 µg",
                "heavy": "325 µg +"
            }
        },
        "dosages": {
            "unit": "µg",
            "threshold": "30 µg",
            "light": "30 - 100 µg",
            "common": "100 - 175 µg",
            "strong": "175 - 325 µg",
            "heavy": "325 µg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 40 min",
                "comeup": "1 - 2 h",
                "peak": "3 - 5 h",
                "offset": "3 - 5 h",
                "total": "8 - 14 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 5400,
                "peak": 14400,
                "offset": 14400,
                "total": 39600
            }
        }
    },
    "al_lad": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "AL-LAD",
        "psychonaut_url": "https://psychonautwiki.org/wiki/AL-LAD",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "µg",
                "threshold": "20 µg",
                "light": "50 - 100 µg",
                "common": "100 - 225 µg",
                "strong": "225 - 350 µg",
                "heavy": "350 µg +"
            }
        },
        "dosages": {
            "unit": "µg",
            "threshold": "20 µg",
            "light": "50 - 100 µg",
            "common": "100 - 225 µg",
            "strong": "225 - 350 µg",
            "heavy": "350 µg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 60 min",
                "comeup": "30 - 60 min",
                "peak": "2,5 - 5 h",
                "offset": "2 - 3 h",
                "total": "7 - 10 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2400,
                "comeup": 2700,
                "peak": 13500,
                "offset": 9000,
                "total": 30600
            }
        }
    },
    "eth_lad": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "ETH-LAD",
        "psychonaut_url": "https://psychonautwiki.org/wiki/ETH-LAD",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "µg",
                "threshold": "15 µg",
                "light": "30 - 60 µg",
                "common": "60 - 150 µg",
                "strong": "150 - 225 µg",
                "heavy": "225 µg +"
            }
        },
        "dosages": {
            "unit": "µg",
            "threshold": "15 µg",
            "light": "30 - 60 µg",
            "common": "60 - 150 µg",
            "strong": "150 - 225 µg",
            "heavy": "225 µg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 40 min",
                "comeup": "45 - 90 min",
                "peak": "4 - 6 h",
                "offset": "2 - 4 h",
                "total": "8 - 12 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 4050,
                "peak": 18000,
                "offset": 10800,
                "total": 36000
            }
        }
    },
    "1cp_lsd": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "1cP-LSD",
        "psychonaut_url": "https://psychonautwiki.org/wiki/1cP-LSD",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "µg",
                "threshold": "15 µg",
                "light": "25 - 75 µg",
                "common": "75 - 150 µg",
                "strong": "150 - 300 µg",
                "heavy": "300 µg +"
            }
        },
        "dosages": {
            "unit": "µg",
            "threshold": "15 µg",
            "light": "25 - 75 µg",
            "common": "75 - 150 µg",
            "strong": "150 - 300 µg",
            "heavy": "300 µg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 60 min",
                "comeup": "45 - 120 min",
                "peak": "3 - 5 h",
                "offset": "3 - 5 h",
                "total": "8 - 12 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2400,
                "comeup": 4950,
                "peak": 14400,
                "offset": 14400,
                "total": 36000
            }
        }
    },
    "lsa": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "LSA",
        "psychonaut_url": "https://psychonautwiki.org/wiki/LSA",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "seeds",
                "threshold": "20 seeds",
                "light": "50 - 100 seeds",
                "common": "100 - 250 seeds",
                "strong": "250 - 400 seeds",
                "heavy": "400 seeds +"
            },
            "Sublingual": {
                "unit": "seeds",
                "threshold": "1 seeds",
                "light": "3 - 5 seeds",
                "common": "5 - 7 seeds",
                "strong": "7 - 12 seeds",
                "heavy": "12 seeds +"
            }
        },
        "dosages": {
            "unit": "seeds",
            "threshold": "20 seeds",
            "light": "50 - 100 seeds",
            "common": "100 - 250 seeds",
            "strong": "250 - 400 seeds",
            "heavy": "400 seeds +"
        }
    },
    "dob": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "DOB",
        "psychonaut_url": "https://psychonautwiki.org/wiki/DOB",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "0,2 mg",
                "light": "0,2 - 0,75 mg",
                "common": "0,75 - 1,75 mg",
                "strong": "1,75 - 3 mg",
                "heavy": "3 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "0,2 mg",
            "light": "0,2 - 0,75 mg",
            "common": "0,75 - 1,75 mg",
            "strong": "1,75 - 3 mg",
            "heavy": "3 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 90 min",
                "comeup": "2 - 4 h",
                "peak": "6 - 10 h",
                "offset": "4 - 8 h",
                "total": "14 - 24 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 3600,
                "comeup": 10800,
                "peak": 28800,
                "offset": 21600,
                "total": 68400
            }
        }
    },
    "dom": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "DOM",
        "psychonaut_url": "https://psychonautwiki.org/wiki/DOM",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "0,5 mg",
                "light": "1 - 3 mg",
                "common": "3 - 5 mg",
                "strong": "5 - 10 mg",
                "heavy": "10 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "0,5 mg",
            "light": "1 - 3 mg",
            "common": "3 - 5 mg",
            "strong": "5 - 10 mg",
            "heavy": "10 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "1 - 2 h",
                "comeup": "2 - 3 h",
                "peak": "6 - 8 h",
                "offset": "3 - 5 h",
                "total": "12 - 16 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 5400,
                "comeup": 9000,
                "peak": 25200,
                "offset": 14400,
                "total": 50400
            }
        }
    },
    "doi": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "DOI",
        "psychonaut_url": "https://psychonautwiki.org/wiki/DOI",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "0,5 mg",
                "light": "0,5 - 1 mg",
                "common": "1 - 2 mg",
                "strong": "2 - 3 mg",
                "heavy": "3 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "0,5 mg",
            "light": "0,5 - 1 mg",
            "common": "1 - 2 mg",
            "strong": "2 - 3 mg",
            "heavy": "3 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "1 - 2 h",
                "comeup": "1,5 - 3 h",
                "peak": "≈ 11 h",
                "offset": "≈ 6 h",
                "total": "16 - 24 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 5400,
                "comeup": 8100,
                "peak": 39600,
                "offset": 21600,
                "total": 72000
            }
        }
    },
    "2c_p": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "2C-P",
        "psychonaut_url": "https://psychonautwiki.org/wiki/2C-P",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "2 - 6 mg",
                "common": "6 - 10 mg",
                "strong": "10 - 16 mg",
                "heavy": "16 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "1 mg",
            "light": "2 - 6 mg",
            "common": "6 - 10 mg",
            "strong": "10 - 16 mg",
            "heavy": "16 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "1 - 3 h",
                "comeup": "2 - 4 h",
                "peak": "4 - 8 h",
                "offset": "3 - 6 h",
                "total": "10 - 20 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 7200,
                "comeup": 10800,
                "peak": 21600,
                "offset": 16200,
                "total": 54000
            }
        }
    },
    "2c_t_7": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "2C-T-7",
        "psychonaut_url": "https://psychonautwiki.org/wiki/2C-T-7",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "3 mg",
                "light": "10 - 15 mg",
                "common": "15 - 25 mg",
                "strong": "25 - 40 mg",
                "heavy": "40 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "2 - 5 mg",
                "common": "5 - 10 mg",
                "strong": "10 - 15 mg",
                "heavy": "15 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "3 mg",
            "light": "10 - 15 mg",
            "common": "15 - 25 mg",
            "strong": "25 - 40 mg",
            "heavy": "40 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "60 - 90 min",
                "comeup": "10 - 30 min",
                "peak": "3 - 5 h",
                "offset": "1 - 3 h",
                "total": "6 - 10 h"
            },
            "Insufflé": {
                "onset": "5 - 15 min",
                "comeup": "20 - 60 min",
                "peak": "2 - 4 h",
                "offset": "1 - 2 h",
                "total": "3 - 7 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 4500,
                "comeup": 1200,
                "peak": 14400,
                "offset": 7200,
                "total": 28800
            },
            "Insufflé": {
                "onset": 600,
                "comeup": 2400,
                "peak": 10800,
                "offset": 5400,
                "total": 18000
            }
        }
    },
    "2c_t_2": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "2C-T-2",
        "psychonaut_url": "https://psychonautwiki.org/wiki/2C-T-2",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "3 mg",
                "light": "5 - 10 mg",
                "common": "10 - 20 mg",
                "strong": "20 - 30 mg",
                "heavy": "30 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "5 - 10 mg",
                "common": "10 - 20 mg",
                "strong": "20 - 25 mg",
                "heavy": "25 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "3 mg",
            "light": "5 - 10 mg",
            "common": "10 - 20 mg",
            "strong": "20 - 30 mg",
            "heavy": "30 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 60 min",
                "comeup": "≈ 1 h 30 min",
                "peak": "2,5 - 5 h",
                "offset": "2 - 4 h",
                "total": "6 - 10 h"
            },
            "Insufflé": {
                "onset": "5 - 15 min",
                "comeup": "≈ 32 min",
                "peak": "2 - 4 h",
                "offset": "1 - 2 h",
                "total": "3 - 7 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2700,
                "comeup": 5400,
                "peak": 13500,
                "offset": 10800,
                "total": 28800
            },
            "Insufflé": {
                "onset": 600,
                "comeup": 1890,
                "peak": 10800,
                "offset": 5400,
                "total": 18000
            }
        }
    },
    "2c_d": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "2C-D",
        "psychonaut_url": "https://psychonautwiki.org/wiki/2C-D",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "3 mg",
                "light": "10 - 25 mg",
                "common": "25 - 50 mg",
                "strong": "50 - 100 mg",
                "heavy": "100 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "3 mg",
            "light": "10 - 25 mg",
            "common": "25 - 50 mg",
            "strong": "50 - 100 mg",
            "heavy": "100 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 45 min",
                "comeup": "20 - 40 min",
                "peak": "1,5 - 2,5 h",
                "offset": "0,5 - 1,5 h",
                "total": "3 - 5 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 1800,
                "peak": 7200,
                "offset": 3600,
                "total": 14400
            }
        }
    },
    "2c_b_fly": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "2C-B-FLY",
        "psychonaut_url": "https://psychonautwiki.org/wiki/2C-B-FLY",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "2 mg",
                "light": "5 - 10 mg",
                "common": "10 - 18 mg",
                "strong": "18 - 25 mg",
                "heavy": "25 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "2 mg",
            "light": "5 - 10 mg",
            "common": "10 - 18 mg",
            "strong": "18 - 25 mg",
            "heavy": "25 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 60 min",
                "comeup": "1 - 2 h",
                "peak": "3 - 5 h",
                "offset": "2 - 3 h",
                "total": "7 - 12 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2700,
                "comeup": 5400,
                "peak": 14400,
                "offset": 9000,
                "total": 34200
            }
        }
    },
    "5_meo_dmt": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "5-MeO-DMT",
        "psychonaut_url": "https://psychonautwiki.org/wiki/5-MeO-DMT",
        "primary_route": "Insufflé",
        "dosages_by_route": {
            "Insufflé": {
                "unit": "mg",
                "threshold": "3 mg",
                "light": "5 - 8 mg",
                "common": "8 - 15 mg",
                "strong": "15 - 25 mg",
                "heavy": "25 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "3 - 6 mg",
                "common": "6 - 12 mg",
                "strong": "12 - 20 mg",
                "heavy": "20 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "3 mg",
            "light": "5 - 8 mg",
            "common": "8 - 15 mg",
            "strong": "15 - 25 mg",
            "heavy": "25 mg +"
        },
        "durations": {
            "Insufflé": {
                "onset": "1 - 10 min",
                "comeup": "≈ 31 s",
                "peak": "10 - 40 min",
                "offset": "30 - 60 min",
                "total": "2 - 3 h"
            },
            "Inhalé": {
                "onset": "5 - 60 s",
                "comeup": "30 - 60 s",
                "peak": "5 - 15 min",
                "offset": "10 - 20 min",
                "total": "20 - 40 min"
            }
        },
        "durations_seconds": {
            "Insufflé": {
                "onset": 330,
                "comeup": 31,
                "peak": 1500,
                "offset": 2700,
                "total": 9000
            },
            "Inhalé": {
                "onset": 33,
                "comeup": 45,
                "peak": 600,
                "offset": 900,
                "total": 1800
            }
        }
    },
    "4_ho_met": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "4-HO-MET",
        "psychonaut_url": "https://psychonautwiki.org/wiki/4-HO-MET",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "5 - 15 mg",
                "common": "15 - 25 mg",
                "strong": "25 - 45 mg",
                "heavy": "45 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 25 mg",
                "common": "25 - 35 mg",
                "strong": "35 - 60 mg",
                "heavy": "60 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "5 mg",
            "light": "5 - 15 mg",
            "common": "15 - 25 mg",
            "strong": "25 - 45 mg",
            "heavy": "45 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 40 min",
                "comeup": "30 - 60 min",
                "peak": "2 - 3 h",
                "offset": "1 - 1,5 h",
                "total": "4 - 6 h"
            },
            "Inhalé": {
                "onset": "15 - 120 s",
                "comeup": "≈ 4 min",
                "peak": "≈ 63 min",
                "offset": "≈ 41 min",
                "total": "25 - 45 min"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1650,
                "comeup": 2700,
                "peak": 9000,
                "offset": 4500,
                "total": 18000
            },
            "Inhalé": {
                "onset": 68,
                "comeup": 216,
                "peak": 3780,
                "offset": 2430,
                "total": 2100
            }
        }
    },
    "4_ho_mipt": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "4-HO-MiPT",
        "psychonaut_url": "https://psychonautwiki.org/wiki/4-HO-MiPT",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 15 mg",
                "common": "15 - 25 mg",
                "strong": "25 - 35 mg",
                "heavy": "35 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "5 mg",
            "light": "10 - 15 mg",
            "common": "15 - 25 mg",
            "strong": "25 - 35 mg",
            "heavy": "35 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 45 min",
                "comeup": "20 - 60 min",
                "peak": "1,5 - 2,5 h",
                "offset": "1 - 2 h",
                "total": "4 - 6 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 2400,
                "peak": 7200,
                "offset": 5400,
                "total": 18000
            }
        }
    },
    "5_meo_mipt": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "5-MeO-MiPT",
        "psychonaut_url": "https://psychonautwiki.org/wiki/5-MeO-MiPT",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "3 mg",
                "light": "3 - 7 mg",
                "common": "7 - 15 mg",
                "strong": "15 - 20 mg",
                "heavy": "20 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "5 - 10 mg",
                "common": "10 - 15 mg",
                "strong": "15 - 20 mg",
                "heavy": "20 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "3 mg",
            "light": "3 - 7 mg",
            "common": "7 - 15 mg",
            "strong": "15 - 20 mg",
            "heavy": "20 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 40 min",
                "comeup": "30 - 60 min",
                "peak": "2 - 3 h",
                "offset": "2 - 3 h",
                "total": "5 - 8 h"
            },
            "Inhalé": {
                "onset": "20 - 60 min",
                "comeup": "≈ 4 min",
                "peak": "1 - 2 h",
                "offset": "1 - 2 h",
                "total": "5 - 8 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 2700,
                "peak": 9000,
                "offset": 9000,
                "total": 23400
            },
            "Inhalé": {
                "onset": 2400,
                "comeup": 216,
                "peak": 5400,
                "offset": 5400,
                "total": 23400
            }
        }
    },
    "dpt": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "DPT",
        "psychonaut_url": "https://psychonautwiki.org/wiki/DPT",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "50 mg",
                "light": "75 - 150 mg",
                "common": "150 - 250 mg",
                "strong": "250 - 350 mg",
                "heavy": "350 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "20 - 50 mg",
                "common": "50 - 100 mg",
                "strong": "100 - 200 mg",
                "heavy": "200 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "10 mg",
                "light": "15 - 20 mg",
                "common": "20 - 50 mg",
                "strong": "50 - 100 mg",
                "heavy": "100 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "50 mg",
            "light": "75 - 150 mg",
            "common": "150 - 250 mg",
            "strong": "250 - 350 mg",
            "heavy": "350 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 60 min",
                "comeup": "≈ 30 min",
                "peak": "≈ 2 h 15 min",
                "offset": "≈ 1 h 30 min",
                "total": "2 - 4 h"
            },
            "Insufflé": {
                "onset": "5 - 20 min",
                "comeup": "≈ 11 min",
                "peak": "30 - 45 min",
                "offset": "≈ 72 min",
                "total": "3 - 5 h"
            },
            "Inhalé": {
                "onset": "≈ 1 min",
                "comeup": "≈ 2 min",
                "peak": "≈ 47 min",
                "offset": "≈ 41 min",
                "total": "30 - 90 min"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2400,
                "comeup": 1800,
                "peak": 8100,
                "offset": 5400,
                "total": 10800
            },
            "Insufflé": {
                "onset": 750,
                "comeup": 630,
                "peak": 2250,
                "offset": 4320,
                "total": 14400
            },
            "Inhalé": {
                "onset": 72,
                "comeup": 144,
                "peak": 2835,
                "offset": 2430,
                "total": 3600
            }
        }
    },
    "dipt": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "DiPT",
        "psychonaut_url": "https://psychonautwiki.org/wiki/DiPT",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "15 mg",
                "light": "15 - 30 mg",
                "common": "30 - 75 mg",
                "strong": "75 - 150 mg",
                "heavy": "150 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 15 mg",
                "common": "15 - 20 mg",
                "strong": "20 - 30 mg",
                "heavy": "30 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "15 mg",
            "light": "15 - 30 mg",
            "common": "30 - 75 mg",
            "strong": "75 - 150 mg",
            "heavy": "150 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 60 min",
                "comeup": "≈ 45 min",
                "peak": "≈ 3 h",
                "offset": "≈ 3 h",
                "total": "3 - 6 h"
            },
            "Inhalé": {
                "onset": "5 - 15 min",
                "comeup": "≈ 4 min",
                "peak": "≈ 63 min",
                "offset": "≈ 81 min",
                "total": "15 - 60 min"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2700,
                "comeup": 2700,
                "peak": 10800,
                "offset": 10800,
                "total": 16200
            },
            "Inhalé": {
                "onset": 600,
                "comeup": 216,
                "peak": 3780,
                "offset": 4860,
                "total": 2250
            }
        }
    },
    "ibogaine": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Ibogaine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Ibogaine",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg/kg of body weight",
                "threshold": "Non renseigné",
                "light": "Non renseigné",
                "common": "15 - 22 mg/kg of body weight",
                "strong": "Non renseigné",
                "heavy": "Non renseigné"
            }
        },
        "dosages": {
            "unit": "mg/kg of body weight",
            "threshold": "Non renseigné",
            "light": "Non renseigné",
            "common": "15 - 22 mg/kg of body weight",
            "strong": "Non renseigné",
            "heavy": "Non renseigné"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 180 min",
                "comeup": "≈ 2 h",
                "peak": "18 - 36 h",
                "offset": "≈ 18 h",
                "total": "≈ 48 h 45 min"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 6300,
                "comeup": 7200,
                "peak": 97200,
                "offset": 64800,
                "total": 175500
            }
        }
    },
    "nbome_25c": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "25C-NBOMe",
        "psychonaut_url": "https://psychonautwiki.org/wiki/25C-NBOMe",
        "primary_route": "Sublingual",
        "dosages_by_route": {
            "Sublingual": {
                "unit": "µg",
                "threshold": "50 µg",
                "light": "100 - 300 µg",
                "common": "300 - 700 µg",
                "strong": "700 - 1000 µg",
                "heavy": "1000 µg +"
            }
        },
        "dosages": {
            "unit": "µg",
            "threshold": "50 µg",
            "light": "100 - 300 µg",
            "common": "300 - 700 µg",
            "strong": "700 - 1000 µg",
            "heavy": "1000 µg +"
        },
        "durations": {
            "Sublingual": {
                "onset": "0 - 15 min",
                "comeup": "30 - 90 min",
                "peak": "4 - 6 h",
                "offset": "1 - 4 h",
                "total": "8 - 10 h"
            }
        },
        "durations_seconds": {
            "Sublingual": {
                "onset": 450,
                "comeup": 3600,
                "peak": 18000,
                "offset": 9000,
                "total": 32400
            }
        }
    },
    "nbome_25b": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "25B-NBOMe",
        "psychonaut_url": "https://psychonautwiki.org/wiki/25B-NBOMe",
        "primary_route": "Sublingual",
        "dosages_by_route": {
            "Sublingual": {
                "unit": "µg",
                "threshold": "50 µg",
                "light": "100 - 300 µg",
                "common": "300 - 500 µg",
                "strong": "500 - 700 µg",
                "heavy": "700 µg +"
            },
            "Insufflé": {
                "unit": "µg",
                "threshold": "25 µg",
                "light": "50 - 200 µg",
                "common": "200 - 350 µg",
                "strong": "350 - 500 µg",
                "heavy": "500 µg +"
            }
        },
        "dosages": {
            "unit": "µg",
            "threshold": "50 µg",
            "light": "100 - 300 µg",
            "common": "300 - 500 µg",
            "strong": "500 - 700 µg",
            "heavy": "700 µg +"
        },
        "durations": {
            "Sublingual": {
                "onset": "20 - 40 min",
                "comeup": "30 - 90 min",
                "peak": "4 - 6 h",
                "offset": "2 - 4 h",
                "total": "8 - 12 h"
            },
            "Insufflé": {
                "onset": "≈ 12 min",
                "comeup": "≈ 28 min",
                "peak": "≈ 3 h 37 min",
                "offset": "≈ 2 h 32 min",
                "total": "≈ 8 h 20 min"
            }
        },
        "durations_seconds": {
            "Sublingual": {
                "onset": 1800,
                "comeup": 3600,
                "peak": 18000,
                "offset": 10800,
                "total": 36000
            },
            "Insufflé": {
                "onset": 692,
                "comeup": 1680,
                "peak": 13000,
                "offset": 9095,
                "total": 30000
            }
        }
    },
    "pcp": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "PCP",
        "psychonaut_url": "https://psychonautwiki.org/wiki/PCP",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "3 - 5 mg",
                "common": "5 - 10 mg",
                "strong": "10 - 15 mg",
                "heavy": "15 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "2 - 4 mg",
                "common": "4 - 8 mg",
                "strong": "8 - 15 mg",
                "heavy": "15 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "2 - 4 mg",
                "common": "4 - 8 mg",
                "strong": "8 - 12 mg",
                "heavy": "12 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "1 mg",
            "light": "3 - 5 mg",
            "common": "5 - 10 mg",
            "strong": "10 - 15 mg",
            "heavy": "15 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 90 min",
                "comeup": "40 - 120 min",
                "peak": "2 - 3 h",
                "offset": "1 - 2 h",
                "total": "4 - 8 h"
            },
            "Insufflé": {
                "onset": "3 - 30 min",
                "comeup": "30 - 90 min",
                "peak": "2 - 3 h",
                "offset": "1 - 2 h",
                "total": "4 - 6 h"
            },
            "Inhalé": {
                "onset": "2 - 20 min",
                "comeup": "20 - 40 min",
                "peak": "2 - 3 h",
                "offset": "1 - 2 h",
                "total": "4 - 6 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 3600,
                "comeup": 4800,
                "peak": 9000,
                "offset": 5400,
                "total": 21600
            },
            "Insufflé": {
                "onset": 990,
                "comeup": 3600,
                "peak": 9000,
                "offset": 5400,
                "total": 18000
            },
            "Inhalé": {
                "onset": 660,
                "comeup": 1800,
                "peak": 9000,
                "offset": 5400,
                "total": 18000
            }
        }
    },
    "2_fdck": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "2-Fluorodeschloroketamine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/2-Fluorodeschloroketamine",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 25 mg",
                "common": "25 - 70 mg",
                "strong": "70 - 140 mg",
                "heavy": "140 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 45 mg",
                "common": "45 - 100 mg",
                "strong": "100 - 175 mg",
                "heavy": "175 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "5 mg",
            "light": "10 - 25 mg",
            "common": "25 - 70 mg",
            "strong": "70 - 140 mg",
            "heavy": "140 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 50 min",
                "comeup": "≈ 23 min",
                "peak": "50 - 100 min",
                "offset": "≈ 45 min",
                "total": "2,5 - 5 h"
            },
            "Insufflé": {
                "onset": "1 - 3 min",
                "comeup": "5 - 10 min",
                "peak": "≈ 44 min",
                "offset": "≈ 36 min",
                "total": "1,5 - 3 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1950,
                "comeup": 1350,
                "peak": 4500,
                "offset": 2700,
                "total": 13500
            },
            "Insufflé": {
                "onset": 120,
                "comeup": 450,
                "peak": 2633,
                "offset": 2160,
                "total": 8100
            }
        }
    },
    "dck": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Deschloroketamine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Deschloroketamine",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "10 mg",
                "light": "10 - 20 mg",
                "common": "20 - 30 mg",
                "strong": "30 - 50 mg",
                "heavy": "50 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 15 mg",
                "common": "15 - 25 mg",
                "strong": "25 - 40 mg",
                "heavy": "40 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "5 - 10 mg",
                "common": "10 - 20 mg",
                "strong": "20 - 40 mg",
                "heavy": "40 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "10 mg",
            "light": "10 - 20 mg",
            "common": "20 - 30 mg",
            "strong": "30 - 50 mg",
            "heavy": "50 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "10 - 30 min",
                "comeup": "30 - 60 min",
                "peak": "1,5 - 2,5 h",
                "offset": "1 - 2 h",
                "total": "4 - 6 h"
            },
            "Insufflé": {
                "onset": "5 - 15 min",
                "comeup": "30 - 60 min",
                "peak": "1,5 - 2,5 h",
                "offset": "1 - 2 h",
                "total": "3 - 6 h"
            },
            "Inhalé": {
                "onset": "≈ 2 min",
                "comeup": "≈ 4 min",
                "peak": "≈ 47 min",
                "offset": "≈ 41 min",
                "total": "30 - 90 min"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1200,
                "comeup": 2700,
                "peak": 7200,
                "offset": 5400,
                "total": 18000
            },
            "Insufflé": {
                "onset": 600,
                "comeup": 2700,
                "peak": 7200,
                "offset": 5400,
                "total": 16200
            },
            "Inhalé": {
                "onset": 96,
                "comeup": 216,
                "peak": 2835,
                "offset": 2430,
                "total": 3600
            }
        }
    },
    "o_pce": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "O-PCE",
        "psychonaut_url": "https://psychonautwiki.org/wiki/O-PCE",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "3 - 5 mg",
                "common": "5 - 15 mg",
                "strong": "15 - 25 mg",
                "heavy": "25 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "2 mg",
                "light": "3 - 6 mg",
                "common": "6 - 12 mg",
                "strong": "12 - 20 mg",
                "heavy": "20 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "1 mg",
            "light": "3 - 5 mg",
            "common": "5 - 15 mg",
            "strong": "15 - 25 mg",
            "heavy": "25 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 40 min",
                "comeup": "≈ 45 min",
                "peak": "≈ 2 h 15 min",
                "offset": "≈ 1 h 30 min",
                "total": "3 - 6 h"
            },
            "Insufflé": {
                "onset": "2 - 5 min",
                "comeup": "≈ 16 min",
                "peak": "≈ 88 min",
                "offset": "≈ 72 min",
                "total": "3 - 5 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 2700,
                "peak": 8100,
                "offset": 5400,
                "total": 16200
            },
            "Insufflé": {
                "onset": 210,
                "comeup": 945,
                "peak": 5265,
                "offset": 4320,
                "total": 14400
            }
        }
    },
    "3_ho_pcp": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "3-HO-PCP",
        "psychonaut_url": "https://psychonautwiki.org/wiki/3-HO-PCP",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "2 - 4 mg",
                "common": "4 - 6 mg",
                "strong": "6 - 8 mg",
                "heavy": "8 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "1 mg",
            "light": "2 - 4 mg",
            "common": "4 - 6 mg",
            "strong": "6 - 8 mg",
            "heavy": "8 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "≈ 40 min",
                "comeup": "60 - 90 min",
                "peak": "≈ 3 h",
                "offset": "≈ 3 h",
                "total": "4 - 6 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2400,
                "comeup": 4500,
                "peak": 10800,
                "offset": 10800,
                "total": 18000
            }
        }
    },
    "diphenidine": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Diphenidine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Diphenidine",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "30 mg",
                "light": "40 - 65 mg",
                "common": "65 - 100 mg",
                "strong": "100 - 130 mg",
                "heavy": "130 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "0 mg",
                "light": "0 - 20 mg",
                "common": "20 - 40 mg",
                "strong": "40 - 55 mg",
                "heavy": "55 mg +"
            },
            "Rectal": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 20 mg",
                "common": "20 - 40 mg",
                "strong": "40 - 80 mg",
                "heavy": "80 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "30 mg",
            "light": "40 - 65 mg",
            "common": "65 - 100 mg",
            "strong": "100 - 130 mg",
            "heavy": "130 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 30 min",
                "comeup": "≈ 1 h 30 min",
                "peak": "≈ 3 h",
                "offset": "≈ 3 h",
                "total": "2 - 5 h"
            },
            "Inhalé": {
                "onset": "30 - 90 s",
                "comeup": "≈ 7 min",
                "peak": "0,5 - 2 h",
                "offset": "20 - 40 min",
                "total": "1 - 3 h"
            },
            "Rectal": {
                "onset": "10 - 30 min",
                "comeup": "≈ 50 min",
                "peak": "≈ 2 h 33 min",
                "offset": "≈ 2 h 42 min",
                "total": "5 - 7 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1350,
                "comeup": 5400,
                "peak": 10800,
                "offset": 10800,
                "total": 12600
            },
            "Inhalé": {
                "onset": 60,
                "comeup": 432,
                "peak": 4500,
                "offset": 1800,
                "total": 7200
            },
            "Rectal": {
                "onset": 1200,
                "comeup": 2970,
                "peak": 9180,
                "offset": 9720,
                "total": 21600
            }
        }
    },
    "mxp": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Methoxphenidine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Methoxphenidine",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "30 mg",
                "light": "50 - 75 mg",
                "common": "75 - 120 mg",
                "strong": "120 - 150 mg",
                "heavy": "150 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "30 mg",
            "light": "50 - 75 mg",
            "common": "75 - 120 mg",
            "strong": "120 - 150 mg",
            "heavy": "150 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 60 min",
                "comeup": "≈ 1 h 30 min",
                "peak": "≈ 3 h",
                "offset": "≈ 3 h",
                "total": "6 - 8 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2700,
                "comeup": 5400,
                "peak": 10800,
                "offset": 10800,
                "total": 25200
            }
        }
    },
    "a_pvp": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "A-PVP",
        "psychonaut_url": "https://psychonautwiki.org/wiki/A-PVP",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "5 - 10 mg",
                "common": "10 - 25 mg",
                "strong": "25 - 40 mg",
                "heavy": "40 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "0,5 mg",
                "light": "1 - 5 mg",
                "common": "5 - 15 mg",
                "strong": "15 - 25 mg",
                "heavy": "25 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "2 - 5 mg",
                "common": "5 - 15 mg",
                "strong": "15 - 25 mg",
                "heavy": "25 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "1 mg",
            "light": "5 - 10 mg",
            "common": "10 - 25 mg",
            "strong": "25 - 40 mg",
            "heavy": "40 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "2 - 20 min",
                "comeup": "≈ 23 min",
                "peak": "1 - 2,5 h",
                "offset": "1 - 5 h",
                "total": "2 - 6 h"
            },
            "Insufflé": {
                "onset": "10 - 30 min",
                "comeup": "≈ 8 min",
                "peak": "20 - 45 min",
                "offset": "30 - 90 min",
                "total": "2 - 5 h"
            },
            "Inhalé": {
                "onset": "20 - 60 s",
                "comeup": "≈ 2 min",
                "peak": "3 - 6 min",
                "offset": "15 - 30 min",
                "total": "30 - 60 min"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 660,
                "comeup": 1350,
                "peak": 6300,
                "offset": 10800,
                "total": 14400
            },
            "Insufflé": {
                "onset": 1200,
                "comeup": 472,
                "peak": 1950,
                "offset": 3600,
                "total": 12600
            },
            "Inhalé": {
                "onset": 40,
                "comeup": 108,
                "peak": 270,
                "offset": 1350,
                "total": 2700
            }
        }
    },
    "a_php": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "A-PHP",
        "psychonaut_url": "https://psychonautwiki.org/wiki/A-PHP",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "5 - 10 mg",
                "common": "10 - 25 mg",
                "strong": "25 - 40 mg",
                "heavy": "40 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "0,5 mg",
                "light": "1 - 5 mg",
                "common": "5 - 15 mg",
                "strong": "15 - 25 mg",
                "heavy": "25 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "2 - 5 mg",
                "common": "5 - 10 mg",
                "strong": "10 - 20 mg",
                "heavy": "20 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "1 mg",
            "light": "5 - 10 mg",
            "common": "10 - 25 mg",
            "strong": "25 - 40 mg",
            "heavy": "40 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "2 - 20 min",
                "comeup": "≈ 23 min",
                "peak": "1 - 2,5 h",
                "offset": "1 - 5 h",
                "total": "2 - 8 h"
            },
            "Insufflé": {
                "onset": "10 - 30 min",
                "comeup": "≈ 8 min",
                "peak": "20 - 45 min",
                "offset": "30 - 90 min",
                "total": "2 - 5 h"
            },
            "Inhalé": {
                "onset": "2 - 8 min",
                "comeup": "≈ 2 min",
                "peak": "30 - 90 min",
                "offset": "1 - 4 h",
                "total": "2 - 5 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 660,
                "comeup": 1350,
                "peak": 6300,
                "offset": 10800,
                "total": 18000
            },
            "Insufflé": {
                "onset": 1200,
                "comeup": 472,
                "peak": 1950,
                "offset": 3600,
                "total": 12600
            },
            "Inhalé": {
                "onset": 300,
                "comeup": 108,
                "peak": 3600,
                "offset": 9000,
                "total": 12600
            }
        }
    },
    "3_mmc": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "3-MMC",
        "psychonaut_url": "https://psychonautwiki.org/wiki/3-MMC",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "25 mg",
                "light": "50 - 150 mg",
                "common": "150 - 250 mg",
                "strong": "250 - 350 mg",
                "heavy": "350 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "10 mg",
                "light": "20 - 40 mg",
                "common": "40 - 60 mg",
                "strong": "60 - 120 mg",
                "heavy": "120 mg +"
            },
            "Intraveineux": {
                "unit": "mg",
                "threshold": "10 mg",
                "light": "10 - 25 mg",
                "common": "25 - 50 mg",
                "strong": "50 - 100 mg",
                "heavy": "100 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "25 mg",
            "light": "50 - 150 mg",
            "common": "150 - 250 mg",
            "strong": "250 - 350 mg",
            "heavy": "350 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "10 - 30 min",
                "comeup": "30 - 60 min",
                "peak": "2 - 3 h",
                "offset": "1 - 1,5 h",
                "total": "4 - 6 h"
            },
            "Insufflé": {
                "onset": "5 - 10 min",
                "comeup": "10 - 20 min",
                "peak": "1 - 1,5 h",
                "offset": "1 - 2 h",
                "total": "2,5 - 4,5 h"
            },
            "Intraveineux": {
                "onset": "15 - 30 s",
                "comeup": "1 - 2 min",
                "peak": "1 - 1,5 h",
                "offset": "1 - 2 h",
                "total": "2 - 4 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1200,
                "comeup": 2700,
                "peak": 9000,
                "offset": 4500,
                "total": 18000
            },
            "Insufflé": {
                "onset": 450,
                "comeup": 900,
                "peak": 4500,
                "offset": 5400,
                "total": 12600
            },
            "Intraveineux": {
                "onset": 23,
                "comeup": 90,
                "peak": 4500,
                "offset": 5400,
                "total": 10800
            }
        }
    },
    "nep": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "NEP",
        "psychonaut_url": "https://psychonautwiki.org/wiki/NEP",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "10 mg",
                "light": "10 - 25 mg",
                "common": "25 - 40 mg",
                "strong": "40 - 60 mg",
                "heavy": "60 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "10 mg",
                "light": "10 - 20 mg",
                "common": "20 - 40 mg",
                "strong": "40 - 60 mg",
                "heavy": "60 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "5 - 15 mg",
                "common": "15 - 30 mg",
                "strong": "30 - 50 mg",
                "heavy": "50 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "10 mg",
            "light": "10 - 25 mg",
            "common": "25 - 40 mg",
            "strong": "40 - 60 mg",
            "heavy": "60 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "≈ 23 min",
                "comeup": "≈ 23 min",
                "peak": "≈ 1 h 30 min",
                "offset": "≈ 2 h",
                "total": "4 - 6 h"
            },
            "Insufflé": {
                "onset": "1 - 8 min",
                "comeup": "5 - 15 min",
                "peak": "30 - 60 min",
                "offset": "30 - 90 min",
                "total": "1 - 3 h"
            },
            "Inhalé": {
                "onset": "≈ 54 s",
                "comeup": "≈ 2 min",
                "peak": "≈ 32 min",
                "offset": "≈ 54 min",
                "total": "1,5 - 3 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1350,
                "comeup": 1350,
                "peak": 5400,
                "offset": 7200,
                "total": 18000
            },
            "Insufflé": {
                "onset": 270,
                "comeup": 600,
                "peak": 2700,
                "offset": 3600,
                "total": 7200
            },
            "Inhalé": {
                "onset": 54,
                "comeup": 108,
                "peak": 1890,
                "offset": 3240,
                "total": 8100
            }
        }
    },
    "hexen": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "N-Ethylhexedrone",
        "psychonaut_url": "https://psychonautwiki.org/wiki/N-Ethylhexedrone",
        "primary_route": "Insufflé",
        "dosages_by_route": {
            "Insufflé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "5 - 24 mg",
                "common": "24 - 30 mg",
                "strong": "30 - 40 mg",
                "heavy": "40 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "2 - 5 mg",
                "common": "5 - 10 mg",
                "strong": "10 - 20 mg",
                "heavy": "20 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "5 mg",
            "light": "5 - 24 mg",
            "common": "24 - 30 mg",
            "strong": "30 - 40 mg",
            "heavy": "40 mg +"
        },
        "durations": {
            "Insufflé": {
                "onset": "2 - 8 min",
                "comeup": "≈ 5 min",
                "peak": "30 - 90 min",
                "offset": "1 - 4 h",
                "total": "2 - 5 h"
            },
            "Inhalé": {
                "onset": "2 - 10 min",
                "comeup": "≈ 1 min",
                "peak": "10 - 30 min",
                "offset": "15 - 30 min",
                "total": "1 - 4 h"
            }
        },
        "durations_seconds": {
            "Insufflé": {
                "onset": 300,
                "comeup": 315,
                "peak": 3600,
                "offset": 9000,
                "total": 12600
            },
            "Inhalé": {
                "onset": 360,
                "comeup": 72,
                "peak": 1200,
                "offset": 1350,
                "total": 9000
            }
        }
    },
    "2_fma": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "2-FMA",
        "psychonaut_url": "https://psychonautwiki.org/wiki/2-FMA",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "5 - 15 mg",
                "common": "15 - 30 mg",
                "strong": "30 - 50 mg",
                "heavy": "50 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "5 - 15 mg",
                "common": "15 - 30 mg",
                "strong": "30 - 50 mg",
                "heavy": "50 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "5 mg",
            "light": "5 - 15 mg",
            "common": "15 - 30 mg",
            "strong": "30 - 50 mg",
            "heavy": "50 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 60 min",
                "comeup": "15 - 40 min",
                "peak": "2,5 - 4 h",
                "offset": "2 - 3 h",
                "total": "7 - 9 h"
            },
            "Insufflé": {
                "onset": "20 - 40 min",
                "comeup": "10 - 20 min",
                "peak": "1 - 3 h",
                "offset": "1,5 - 3 h",
                "total": "4 - 6 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2700,
                "comeup": 1650,
                "peak": 11700,
                "offset": 9000,
                "total": 28800
            },
            "Insufflé": {
                "onset": 1800,
                "comeup": 900,
                "peak": 7200,
                "offset": 8100,
                "total": 18000
            }
        }
    },
    "4_fa": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "4-FA",
        "psychonaut_url": "https://psychonautwiki.org/wiki/4-FA",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "40 mg",
                "light": "40 - 100 mg",
                "common": "100 - 130 mg",
                "strong": "130 - 150 mg",
                "heavy": "150 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "40 mg",
            "light": "40 - 100 mg",
            "common": "100 - 130 mg",
            "strong": "130 - 150 mg",
            "heavy": "150 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "45 - 75 min",
                "comeup": "30 - 75 min",
                "peak": "2,5 - 3,5 h",
                "offset": "2 - 3 h",
                "total": "5 - 8 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 3600,
                "comeup": 3150,
                "peak": 10800,
                "offset": 9000,
                "total": 23400
            }
        }
    },
    "ethylphenidate": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Ethylphenidate",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Ethylphenidate",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "10 mg",
                "light": "20 - 40 mg",
                "common": "40 - 80 mg",
                "strong": "80 - 120 mg",
                "heavy": "120 mg +"
            },
            "Rectal": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "5 - 15 mg",
                "common": "15 - 30 mg",
                "strong": "30 - 50 mg",
                "heavy": "50 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "10 mg",
            "light": "20 - 40 mg",
            "common": "40 - 80 mg",
            "strong": "80 - 120 mg",
            "heavy": "120 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "40 - 120 min",
                "comeup": "≈ 23 min",
                "peak": "≈ 1 h 30 min",
                "offset": "≈ 2 h",
                "total": "4 - 7 h"
            },
            "Rectal": {
                "onset": "5 - 20 min",
                "comeup": "≈ 12 min",
                "peak": "≈ 77 min",
                "offset": "≈ 1 h 48 min",
                "total": "2 - 6 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 4800,
                "comeup": 1350,
                "peak": 5400,
                "offset": 7200,
                "total": 19800
            },
            "Rectal": {
                "onset": 750,
                "comeup": 743,
                "peak": 4590,
                "offset": 6480,
                "total": 14400
            }
        }
    },
    "nicotine": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Nicotine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Nicotine",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "0,2 mg",
                "light": "1 - 3 mg",
                "common": "3 - 5 mg",
                "strong": "5 - 7 mg",
                "heavy": "7 mg +"
            },
            "Buccal": {
                "unit": "mg",
                "threshold": "0,2 mg",
                "light": "0,5 - 2 mg",
                "common": "2 - 4 mg",
                "strong": "4 - 6 mg",
                "heavy": "6 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "0,2 mg",
                "light": "0,3 - 0,8 mg",
                "common": "0,8 - 1,5 mg",
                "strong": "1,5 - 3,5 mg",
                "heavy": "3,5 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "0,2 mg",
            "light": "1 - 3 mg",
            "common": "3 - 5 mg",
            "strong": "5 - 7 mg",
            "heavy": "7 mg +"
        },
        "bioavailability_by_route": {
            "Oral": {
                "value": "Non quantifiée",
                "source": "PsychonautWiki API"
            },
            "Buccal": {
                "value": "Non quantifiée",
                "source": "PsychonautWiki API"
            },
            "Inhalé": {
                "value": "Non quantifiée",
                "source": "PsychonautWiki API"
            }
        },
        "durations": {
            "Oral": {
                "onset": "20 - 40 min",
                "comeup": "60 - 90 min",
                "peak": "60 - 90 min",
                "offset": "2,5 - 3,5 h",
                "total": "5 - 7 h"
            },
            "Buccal": {
                "onset": "3 - 15 min",
                "comeup": "3 - 15 min",
                "peak": "5 - 20 min",
                "offset": "1 - 2 h",
                "total": "45 - 90 min"
            },
            "Inhalé": {
                "onset": "5 - 20 s",
                "comeup": "5 - 10 s",
                "peak": "2 - 5 min",
                "offset": "1 - 2 h",
                "total": "1 - 3 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 4500,
                "peak": 4500,
                "offset": 10800,
                "total": 21600
            },
            "Buccal": {
                "onset": 540,
                "comeup": 540,
                "peak": 750,
                "offset": 5400,
                "total": 4050
            },
            "Inhalé": {
                "onset": 13,
                "comeup": 8,
                "peak": 210,
                "offset": 5400,
                "total": 7200
            }
        }
    },
    "ephedrine": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Ephedrine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Ephedrine",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 20 mg",
                "common": "20 - 30 mg",
                "strong": "30 - 50 mg",
                "heavy": "50 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "5 mg",
            "light": "10 - 20 mg",
            "common": "20 - 30 mg",
            "strong": "30 - 50 mg",
            "heavy": "50 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 90 min",
                "comeup": "≈ 30 min",
                "peak": "≈ 2 h",
                "offset": "≈ 1 h 30 min",
                "total": "2 - 5 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 3300,
                "comeup": 1800,
                "peak": 7200,
                "offset": 5400,
                "total": 12600
            }
        }
    },
    "methylone": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Methylone",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Methylone",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "75 mg",
                "light": "75 - 150 mg",
                "common": "150 - 225 mg",
                "strong": "225 - 325 mg",
                "heavy": "325 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "75 mg",
            "light": "75 - 150 mg",
            "common": "150 - 225 mg",
            "strong": "225 - 325 mg",
            "heavy": "325 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 45 min",
                "comeup": "15 - 45 min",
                "peak": "60 - 90 min",
                "offset": "60 - 90 min",
                "total": "2,5 - 4 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 1800,
                "peak": 4500,
                "offset": 4500,
                "total": 11700
            }
        }
    },
    "ethylone": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Ethylone",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Ethylone",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "75 mg",
                "light": "75 - 150 mg",
                "common": "150 - 225 mg",
                "strong": "225 - 325 mg",
                "heavy": "325 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "75 mg",
            "light": "75 - 150 mg",
            "common": "150 - 225 mg",
            "strong": "225 - 325 mg",
            "heavy": "325 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 45 min",
                "comeup": "≈ 45 min",
                "peak": "60 - 90 min",
                "offset": "60 - 120 min",
                "total": "2 - 4 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 2700,
                "peak": 4500,
                "offset": 5400,
                "total": 10800
            }
        }
    },
    "6_apb": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "6-APB",
        "psychonaut_url": "https://psychonautwiki.org/wiki/6-APB",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "15 mg",
                "light": "30 - 60 mg",
                "common": "60 - 90 mg",
                "strong": "90 - 120 mg",
                "heavy": "120 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "15 mg",
            "light": "30 - 60 mg",
            "common": "60 - 90 mg",
            "strong": "90 - 120 mg",
            "heavy": "120 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 60 min",
                "comeup": "60 - 120 min",
                "peak": "3 - 4 h",
                "offset": "2 - 3 h",
                "total": "7 - 10 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2700,
                "comeup": 5400,
                "peak": 12600,
                "offset": 9000,
                "total": 30600
            }
        }
    },
    "5_apb": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "5-APB",
        "psychonaut_url": "https://psychonautwiki.org/wiki/5-APB",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "20 mg",
                "light": "40 - 60 mg",
                "common": "60 - 80 mg",
                "strong": "80 - 100 mg",
                "heavy": "100 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "20 mg",
            "light": "40 - 60 mg",
            "common": "60 - 80 mg",
            "strong": "80 - 100 mg",
            "heavy": "100 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 60 min",
                "comeup": "45 - 90 min",
                "peak": "2 - 4 h",
                "offset": "1,5 - 3 h",
                "total": "5 - 8 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2400,
                "comeup": 4050,
                "peak": 10800,
                "offset": 8100,
                "total": 23400
            }
        }
    },
    "mdea": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "MDEA",
        "psychonaut_url": "https://psychonautwiki.org/wiki/MDEA",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "40 mg",
                "light": "70 - 120 mg",
                "common": "120 - 180 mg",
                "strong": "180 - 225 mg",
                "heavy": "225 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "40 mg",
            "light": "70 - 120 mg",
            "common": "120 - 180 mg",
            "strong": "180 - 225 mg",
            "heavy": "225 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 60 min",
                "comeup": "15 - 30 min",
                "peak": "1,5 - 2 h",
                "offset": "1 - 2 h",
                "total": "3 - 6 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2400,
                "comeup": 1350,
                "peak": 6300,
                "offset": 5400,
                "total": 16200
            }
        }
    },
    "gbl": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "GBL",
        "psychonaut_url": "https://psychonautwiki.org/wiki/GBL",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mL",
                "threshold": "0,3 mL",
                "light": "0,3 - 0,9 mL",
                "common": "0,9 - 1,5 mL",
                "strong": "1,5 - 3 mL",
                "heavy": "3 mL +"
            }
        },
        "dosages": {
            "unit": "mL",
            "threshold": "0,3 mL",
            "light": "0,3 - 0,9 mL",
            "common": "0,9 - 1,5 mL",
            "strong": "1,5 - 3 mL",
            "heavy": "3 mL +"
        },
        "durations": {
            "Oral": {
                "onset": "3 - 10 min",
                "comeup": "5 - 15 min",
                "peak": "30 - 45 min",
                "offset": "15 - 30 min",
                "total": "1 - 2 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 390,
                "comeup": 600,
                "peak": 2250,
                "offset": 1350,
                "total": 5400
            }
        }
    },
    "bdo": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "1,4-Butanediol",
        "psychonaut_url": "https://psychonautwiki.org/wiki/1%2C4-Butanediol",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mL",
                "threshold": "0,5 mL",
                "light": "0,5 - 1 mL",
                "common": "1 - 2,5 mL",
                "strong": "2,5 - 4 mL",
                "heavy": "4 mL +"
            }
        },
        "dosages": {
            "unit": "mL",
            "threshold": "0,5 mL",
            "light": "0,5 - 1 mL",
            "common": "1 - 2,5 mL",
            "strong": "2,5 - 4 mL",
            "heavy": "4 mL +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 60 min",
                "comeup": "≈ 15 min",
                "peak": "1 - 2 h",
                "offset": "1,5 - 2 h",
                "total": "3 - 5 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2400,
                "comeup": 900,
                "peak": 5400,
                "offset": 6300,
                "total": 14400
            }
        }
    },
    "zolpidem": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Zolpidem",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Zolpidem",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 20 mg",
                "common": "20 - 30 mg",
                "strong": "30 - 50 mg",
                "heavy": "50 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "5 mg",
            "light": "10 - 20 mg",
            "common": "20 - 30 mg",
            "strong": "30 - 50 mg",
            "heavy": "50 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 45 min",
                "comeup": "30 - 45 min",
                "peak": "3 - 6 h",
                "offset": "4 - 5 h",
                "total": "5 - 10 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 2250,
                "peak": 16200,
                "offset": 16200,
                "total": 27000
            }
        }
    },
    "zopiclone": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Zopiclone",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Zopiclone",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "2 mg",
                "light": "3,5 - 5 mg",
                "common": "5 - 7,5 mg",
                "strong": "7,5 - 15 mg",
                "heavy": "15 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "2 mg",
            "light": "3,5 - 5 mg",
            "common": "5 - 7,5 mg",
            "strong": "7,5 - 15 mg",
            "heavy": "15 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "10 - 30 min",
                "comeup": "≈ 30 min",
                "peak": "3 - 4 h",
                "offset": "≈ 4 h",
                "total": "3,5 - 9 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1200,
                "comeup": 1800,
                "peak": 12600,
                "offset": 14400,
                "total": 22500
            }
        }
    },
    "alprazolam": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Alprazolam",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Alprazolam",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "0,1 mg",
                "light": "0,25 - 0,5 mg",
                "common": "0,5 - 1,5 mg",
                "strong": "1,5 - 2 mg",
                "heavy": "2 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "0,05 mg",
                "light": "0,05 - 0,25 mg",
                "common": "0,25 - 0,5 mg",
                "strong": "0,5 - 1 mg",
                "heavy": "1 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "0,1 mg",
            "light": "0,25 - 0,5 mg",
            "common": "0,5 - 1,5 mg",
            "strong": "1,5 - 2 mg",
            "heavy": "2 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 30 min",
                "comeup": "50 - 90 min",
                "peak": "1 - 2 h",
                "offset": "2 - 4 h",
                "total": "6 - 8 h"
            },
            "Inhalé": {
                "onset": "5 - 10 s",
                "comeup": "5 - 10 min",
                "peak": "1 - 2 h",
                "offset": "2 - 3 h",
                "total": "4 - 5 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1350,
                "comeup": 4200,
                "peak": 5400,
                "offset": 10800,
                "total": 25200
            },
            "Inhalé": {
                "onset": 8,
                "comeup": 450,
                "peak": 5400,
                "offset": 9000,
                "total": 16200
            }
        }
    },
    "diazepam": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Diazepam",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Diazepam",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "2,5 - 5 mg",
                "common": "5 - 15 mg",
                "strong": "15 - 30 mg",
                "heavy": "30 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "1 mg",
            "light": "2,5 - 5 mg",
            "common": "5 - 15 mg",
            "strong": "15 - 30 mg",
            "heavy": "30 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 40 min",
                "comeup": "≈ 45 min",
                "peak": "60 - 90 min",
                "offset": "≈ 6 h",
                "total": "4 - 8 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 2700,
                "peak": 4500,
                "offset": 21600,
                "total": 21600
            }
        }
    },
    "clonazepam": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Clonazepam",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Clonazepam",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "0,1 mg",
                "light": "0,25 - 0,5 mg",
                "common": "0,5 - 1 mg",
                "strong": "1 - 2 mg",
                "heavy": "2 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "0,1 mg",
            "light": "0,25 - 0,5 mg",
            "common": "0,5 - 1 mg",
            "strong": "1 - 2 mg",
            "heavy": "2 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 60 min",
                "comeup": "≈ 60 min",
                "peak": "2 - 4 h",
                "offset": "3 - 6 h",
                "total": "8 - 12 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2400,
                "comeup": 3600,
                "peak": 10800,
                "offset": 16200,
                "total": 36000
            }
        }
    },
    "etizolam": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Etizolam",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Etizolam",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "0,2 mg",
                "light": "0,5 - 1 mg",
                "common": "1 - 2 mg",
                "strong": "2 - 5 mg",
                "heavy": "5 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "0,2 mg",
            "light": "0,5 - 1 mg",
            "common": "1 - 2 mg",
            "strong": "2 - 5 mg",
            "heavy": "5 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 30 min",
                "comeup": "30 - 60 min",
                "peak": "2 - 3 h",
                "offset": "1,5 - 2,5 h",
                "total": "5 - 7 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1350,
                "comeup": 2700,
                "peak": 9000,
                "offset": 7200,
                "total": 21600
            }
        }
    },
    "flualprazolam": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Flualprazolam",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Flualprazolam",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "0,05 mg",
                "light": "0,1 - 0,3 mg",
                "common": "0,3 - 0,5 mg",
                "strong": "0,5 - 1 mg",
                "heavy": "1 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "0,05 mg",
            "light": "0,1 - 0,3 mg",
            "common": "0,3 - 0,5 mg",
            "strong": "0,5 - 1 mg",
            "heavy": "1 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 40 min",
                "comeup": "≈ 60 min",
                "peak": "1 - 2 h",
                "offset": "2 - 6 h",
                "total": "5 - 8 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 3600,
                "peak": 5400,
                "offset": 14400,
                "total": 23400
            }
        }
    },
    "clonazolam": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Clonazolam",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Clonazolam",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "µg",
                "threshold": "50 µg",
                "light": "75 - 125 µg",
                "common": "125 - 300 µg",
                "strong": "300 - 500 µg",
                "heavy": "500 µg +"
            }
        },
        "dosages": {
            "unit": "µg",
            "threshold": "50 µg",
            "light": "75 - 125 µg",
            "common": "125 - 300 µg",
            "strong": "300 - 500 µg",
            "heavy": "500 µg +"
        },
        "durations": {
            "Oral": {
                "onset": "10 - 30 min",
                "comeup": "≈ 45 min",
                "peak": "≈ 3 h",
                "offset": "≈ 8 h",
                "total": "6 - 10 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1200,
                "comeup": 2700,
                "peak": 10800,
                "offset": 28800,
                "total": 28800
            }
        }
    },
    "gabapentine": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Gabapentin",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Gabapentin",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "200 mg",
                "light": "200 - 900 mg",
                "common": "900 - 1500 mg",
                "strong": "1500 - 2400 mg",
                "heavy": "2400 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "200 mg",
            "light": "200 - 900 mg",
            "common": "900 - 1500 mg",
            "strong": "1500 - 2400 mg",
            "heavy": "2400 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 120 min",
                "comeup": "≈ 1 h 30 min",
                "peak": "120 - 180 min",
                "offset": "≈ 4 h 30 min",
                "total": "6 - 10 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 4500,
                "comeup": 5400,
                "peak": 9000,
                "offset": 16200,
                "total": 28800
            }
        },
        "bioavailability_by_route": {
            "Oral": {
                "value": "27 - 60 %",
                "source": "PsychonautWiki API"
            }
        }
    },
    "baclofene": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Baclofen",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Baclofen",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 20 mg",
                "common": "20 - 50 mg",
                "strong": "50 - 100 mg",
                "heavy": "100 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "5 mg",
            "light": "10 - 20 mg",
            "common": "20 - 50 mg",
            "strong": "50 - 100 mg",
            "heavy": "100 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 75 min",
                "comeup": "1 - 1,5 h",
                "peak": "1 - 2 h",
                "offset": "1,5 - 2,5 h",
                "total": "8 - 14 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 3150,
                "comeup": 4500,
                "peak": 5400,
                "offset": 7200,
                "total": 39600
            }
        }
    },
    "carisoprodol": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Carisoprodol",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Carisoprodol",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "50 mg",
                "light": "100 - 325 mg",
                "common": "325 - 500 mg",
                "strong": "500 - 750 mg",
                "heavy": "750 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "50 mg",
            "light": "100 - 325 mg",
            "common": "325 - 500 mg",
            "strong": "500 - 750 mg",
            "heavy": "750 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 60 min",
                "comeup": "≈ 45 min",
                "peak": "2 - 5 h",
                "offset": "≈ 3 h",
                "total": "≈ 7 h 53 min"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2250,
                "comeup": 2700,
                "peak": 12600,
                "offset": 10800,
                "total": 28350
            }
        }
    },
    "morphine": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Morphine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Morphine",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "10 mg",
                "light": "10 - 15 mg",
                "common": "15 - 20 mg",
                "strong": "20 - 30 mg",
                "heavy": "30 mg +"
            },
            "Intraveineux": {
                "unit": "mg",
                "threshold": "3,33 mg",
                "light": "3,33 - 5 mg",
                "common": "5 - 7,5 mg",
                "strong": "7,5 - 10 mg",
                "heavy": "10 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "10 mg",
            "light": "10 - 15 mg",
            "common": "15 - 20 mg",
            "strong": "20 - 30 mg",
            "heavy": "30 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "10 - 30 min",
                "comeup": "20 - 40 min",
                "peak": "2 - 3 h",
                "offset": "1 - 2 h",
                "total": "4 - 6 h"
            },
            "Intraveineux": {
                "onset": "0 - 30 s",
                "comeup": "2 - 5 min",
                "peak": "1,5 - 2,5 h",
                "offset": "60 - 90 min",
                "total": "4 - 5 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1200,
                "comeup": 1800,
                "peak": 9000,
                "offset": 5400,
                "total": 18000
            },
            "Intraveineux": {
                "onset": 15,
                "comeup": 210,
                "peak": 7200,
                "offset": 4500,
                "total": 16200
            }
        },
        "bioavailability_by_route": {
            "Oral": {
                "value": "35 - 40 %",
                "source": "PsychonautWiki API"
            }
        }
    },
    "methadone": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Methadone",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Methadone",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "3 - 5 mg",
                "common": "5 - 15 mg",
                "strong": "15 - 30 mg",
                "heavy": "30 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "1 mg",
            "light": "3 - 5 mg",
            "common": "5 - 15 mg",
            "strong": "15 - 30 mg",
            "heavy": "30 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 90 min",
                "comeup": "2 - 4 h",
                "peak": "4 - 6 h",
                "offset": "4 - 6 h",
                "total": "10 - 19 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 3300,
                "comeup": 10800,
                "peak": 18000,
                "offset": 18000,
                "total": 52200
            }
        }
    },
    "buprenorphine": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Buprenorphine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Buprenorphine",
        "primary_route": "Sublingual",
        "dosages_by_route": {
            "Sublingual": {
                "unit": "mg",
                "threshold": "0,3 mg",
                "light": "1 - 2 mg",
                "common": "2 - 4 mg",
                "strong": "4 - 8 mg",
                "heavy": "8 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "0,2 mg",
                "light": "0,2 - 0,4 mg",
                "common": "0,4 - 0,8 mg",
                "strong": "0,8 - 1,5 mg",
                "heavy": "1,5 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "0,3 mg",
            "light": "1 - 2 mg",
            "common": "2 - 4 mg",
            "strong": "4 - 8 mg",
            "heavy": "8 mg +"
        },
        "durations": {
            "Sublingual": {
                "onset": "40 - 80 min",
                "comeup": "≈ 68 min",
                "peak": "1,5 - 2 h",
                "offset": "≈ 17 h 06 min",
                "total": "18 - 24 h"
            },
            "Insufflé": {
                "onset": "30 - 60 min",
                "comeup": "≈ 32 min",
                "peak": "4 - 8 h",
                "offset": "≈ 14 h 24 min",
                "total": "8 - 14 h"
            }
        },
        "durations_seconds": {
            "Sublingual": {
                "onset": 3600,
                "comeup": 4050,
                "peak": 6300,
                "offset": 61560,
                "total": 75600
            },
            "Insufflé": {
                "onset": 2700,
                "comeup": 1890,
                "peak": 21600,
                "offset": 51840,
                "total": 39600
            }
        }
    },
    "hydromorphone": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Hydromorphone",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Hydromorphone",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "0,5 mg",
                "light": "1 - 2 mg",
                "common": "2 - 4 mg",
                "strong": "4 - 8 mg",
                "heavy": "8 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "1 - 2 mg",
                "common": "2 - 4 mg",
                "strong": "4 - 8 mg",
                "heavy": "8 mg +"
            },
            "Intraveineux": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "1 - 2 mg",
                "common": "2 - 4 mg",
                "strong": "4 - 6 mg",
                "heavy": "6 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "0,5 mg",
            "light": "1 - 2 mg",
            "common": "2 - 4 mg",
            "strong": "4 - 8 mg",
            "heavy": "8 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "5 - 15 min",
                "comeup": "1 - 2 h",
                "peak": "15 - 20 min",
                "offset": "30 - 60 min",
                "total": "4 - 6 h"
            },
            "Insufflé": {
                "onset": "1 - 5 min",
                "comeup": "5 - 10 min",
                "peak": "30 - 60 min",
                "offset": "15 - 30 min",
                "total": "4 - 6 h"
            },
            "Intraveineux": {
                "onset": "4 - 5 min",
                "comeup": "10 - 20 min",
                "peak": "30 - 90 min",
                "offset": "1 - 2 h",
                "total": "3 - 4 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 600,
                "comeup": 5400,
                "peak": 1050,
                "offset": 2700,
                "total": 18000
            },
            "Insufflé": {
                "onset": 180,
                "comeup": 450,
                "peak": 2700,
                "offset": 1350,
                "total": 18000
            },
            "Intraveineux": {
                "onset": 270,
                "comeup": 900,
                "peak": 3600,
                "offset": 5400,
                "total": 12600
            }
        }
    },
    "tapentadol": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Tapentadol",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Tapentadol",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "12,5 mg",
                "light": "25 - 50 mg",
                "common": "50 - 75 mg",
                "strong": "75 - 150 mg",
                "heavy": "150 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "12,5 mg",
            "light": "25 - 50 mg",
            "common": "50 - 75 mg",
            "strong": "75 - 150 mg",
            "heavy": "150 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "15 - 30 min",
                "comeup": "30 - 45 min",
                "peak": "1 - 2 h",
                "offset": "2 - 3 h",
                "total": "4 - 6 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1350,
                "comeup": 2250,
                "peak": 5400,
                "offset": 9000,
                "total": 18000
            }
        }
    },
    "o_dsmt": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "O-Desmethyltramadol",
        "psychonaut_url": "https://psychonautwiki.org/wiki/O-Desmethyltramadol",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 25 mg",
                "common": "25 - 50 mg",
                "strong": "50 - 100 mg",
                "heavy": "100 mg +"
            },
            "Sublingual": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 25 mg",
                "common": "25 - 50 mg",
                "strong": "50 - 80 mg",
                "heavy": "80 mg +"
            },
            "Intraveineux": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "5 - 12,5 mg",
                "common": "12,5 - 25 mg",
                "strong": "25 - 50 mg",
                "heavy": "50 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "5 mg",
            "light": "10 - 25 mg",
            "common": "25 - 50 mg",
            "strong": "50 - 100 mg",
            "heavy": "100 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "20 - 40 min",
                "comeup": "30 - 40 min",
                "peak": "2 - 5 h",
                "offset": "2 - 4 h",
                "total": "6 - 10 h"
            },
            "Sublingual": {
                "onset": "20 - 40 min",
                "comeup": "≈ 34 min",
                "peak": "2 - 5 h",
                "offset": "2 - 4 h",
                "total": "5 - 10 h"
            },
            "Intraveineux": {
                "onset": "10 - 15 s",
                "comeup": "≈ 2 min",
                "peak": "2 - 5 h",
                "offset": "2 - 4 h",
                "total": "5 - 8 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 2100,
                "peak": 12600,
                "offset": 10800,
                "total": 28800
            },
            "Sublingual": {
                "onset": 1800,
                "comeup": 2025,
                "peak": 12600,
                "offset": 10800,
                "total": 27000
            },
            "Intraveineux": {
                "onset": 13,
                "comeup": 108,
                "peak": 12600,
                "offset": 10800,
                "total": 23400
            }
        }
    },
    "tianeptine": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Tianeptine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Tianeptine",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "3 mg",
                "light": "6 - 12 mg",
                "common": "12 - 35 mg",
                "strong": "35 - 100 mg",
                "heavy": "100 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "3 mg",
            "light": "6 - 12 mg",
            "common": "12 - 35 mg",
            "strong": "35 - 100 mg",
            "heavy": "100 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 60 min",
                "comeup": "15 - 30 min",
                "peak": "60 - 90 min",
                "offset": "30 - 60 min",
                "total": "2 - 3 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 2700,
                "comeup": 1350,
                "peak": 4500,
                "offset": 2700,
                "total": 9000
            }
        }
    },
    "cbd": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Cannabidiol",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Cannabidiol",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "2 mg",
                "light": "5 - 15 mg",
                "common": "15 - 30 mg",
                "strong": "30 - 60 mg",
                "heavy": "60 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "2 mg",
            "light": "5 - 15 mg",
            "common": "15 - 30 mg",
            "strong": "30 - 60 mg",
            "heavy": "60 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "≈ 30 min",
                "comeup": "15 - 30 min",
                "peak": "≈ 2 h",
                "offset": "1 - 1,5 h",
                "total": "1,5 - 4 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 1800,
                "comeup": 1350,
                "peak": 7200,
                "offset": 4500,
                "total": 9900
            }
        }
    },
    "dph": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Diphenhydramine",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Diphenhydramine",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "25 mg",
                "light": "100 - 200 mg",
                "common": "200 - 400 mg",
                "strong": "400 - 700 mg",
                "heavy": "700 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "25 mg",
            "light": "100 - 200 mg",
            "common": "200 - 400 mg",
            "strong": "400 - 700 mg",
            "heavy": "700 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "30 - 90 min",
                "comeup": "45 - 90 min",
                "peak": "1 - 4 h",
                "offset": "2 - 6 h",
                "total": "3 - 10 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 3600,
                "comeup": 4050,
                "peak": 9000,
                "offset": 14400,
                "total": 23400
            }
        }
    },
    "datura": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Datura",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Datura",
        "primary_route": "Oral",
        "durations": {
            "Oral": {
                "onset": "20 - 120 min",
                "comeup": "60 - 120 min",
                "peak": "≈ 16 h",
                "offset": "≈ 48 h",
                "total": "≈ 66 h 40 min"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 4200,
                "comeup": 5400,
                "peak": 57600,
                "offset": 172800,
                "total": 240000
            }
        }
    },
    "nutmeg": {
        "data_source": "PsychonautWiki API",
        "psychonaut_name": "Myristicin",
        "psychonaut_url": "https://psychonautwiki.org/wiki/Myristicin",
        "primary_route": "Oral",
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "0 mg",
                "light": "50 - 200 mg",
                "common": "200 - 500 mg",
                "strong": "500 - 800 mg",
                "heavy": "800 mg +"
            }
        },
        "dosages": {
            "unit": "mg",
            "threshold": "0 mg",
            "light": "50 - 200 mg",
            "common": "200 - 500 mg",
            "strong": "500 - 800 mg",
            "heavy": "800 mg +"
        },
        "durations": {
            "Oral": {
                "onset": "3 - 8 h",
                "comeup": "1 - 4 h",
                "peak": "9 - 12 h",
                "offset": "12 - 48 h",
                "total": "12 - 72 h"
            }
        },
        "durations_seconds": {
            "Oral": {
                "onset": 19800,
                "comeup": 9000,
                "peak": 37800,
                "offset": 108000,
                "total": 151200
            }
        }
    }
};

    function clone(value) {
        if (value === null || value === undefined) return value;
        return JSON.parse(JSON.stringify(value));
    }

    function applyOverrides(target) {
        if (!target) return;
        Object.keys(OVERRIDES).forEach(function (key) {
            if (!target[key]) return;
            var patch = clone(OVERRIDES[key]);
            Object.keys(patch).forEach(function (field) {
                target[key][field] = patch[field];
            });
        });
    }

    if (typeof SUBSTANCE_DB !== "undefined") applyOverrides(SUBSTANCE_DB);
    if (global.SEUIL_RICH) applyOverrides(global.SEUIL_RICH);
    if (global.window && global.window.SEUIL_RICH && global.window.SEUIL_RICH !== global.SEUIL_RICH) {
        applyOverrides(global.window.SEUIL_RICH);
    }
    global.SEUIL_PSYCHONAUT_OVERRIDES = OVERRIDES;
    if (global.window) global.window.SEUIL_PSYCHONAUT_OVERRIDES = OVERRIDES;
})(typeof globalThis !== "undefined" ? globalThis : window);
