export const renovationPrestations = [
  {
    "slug": "renovation-complete-cuisine",
    "nom": "Rénovation complète de cuisine",
    "description": "Rénovation complète incluant démolition, électricité, plomberie, pose mobilier et finitions",
    "unite_prix": "forfait",
    "prix_marche": {"min": 8000, "max": 25000},
    "base_calcul": {"prix_moyen_unitaire": 15000, "temps_moyen_heures": 120},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Démolition existant", "impact_prix": 1500}, {"nom": "Électricité cuisine", "impact_prix": 2000}],
    "options": [{"nom": "Îlot central", "impact_prix": 3000}],
    "dependances": ["demolition", "electricite", "plomberie"],
    "questionnaire": {
      "surface_question": "Surface de la cuisine (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "forme_cuisine",
          "label": "Forme de la cuisine",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "lineaire", "label": "Linéaire", "icon": "minus"},
            {"value": "l", "label": "En L", "icon": "corner-down-right"},
            {"value": "u", "label": "En U", "icon": "square"},
            {"value": "ilot", "label": "Avec îlot", "icon": "circle"}
          ]
        },
        {
          "id": "nb_personnes",
          "label": "Nombre de personnes dans le foyer",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 10
        }
      ]
    }
  },
  {
    "slug": "pose-cuisine-complete",
    "nom": "Pose cuisine complète",
    "description": "Installation complète d'une cuisine neuve avec raccordements électricité et plomberie",
    "unite_prix": "forfait",
    "prix_marche": {"min": 5000, "max": 20000},
    "base_calcul": {"prix_moyen_unitaire": 12000, "temps_moyen_heures": 60},
    "multiplicateurs_gamme": {"economique": 0.8, "standard": 1, "premium": 1.5},
    "multiplicateurs_etat": {"neuf": 1, "renovation": 1.1, "renovation_lourde": 1.2},
    "sous_prestations": [{"nom": "Raccordement électrique", "impact_prix": 800}, {"nom": "Raccordement plomberie", "impact_prix": 1200}],
    "options": [{"nom": "Électroménager encastrable", "impact_prix": 2500}, {"nom": "Plan de travail sur mesure", "impact_prix": 1500}],
    "dependances": ["electricite", "plomberie"],
    "questionnaire": {
      "surface_question": "Surface de la cuisine (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_cuisine",
          "label": "Type de cuisine",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "lineaire", "label": "Linéaire", "icon": "minus"},
            {"value": "angle", "label": "En L (angle)", "icon": "corner-down-right"},
            {"value": "parallele", "label": "Parallèle", "icon": "equal"},
            {"value": "ilot", "label": "Avec îlot", "icon": "square"}
          ]
        },
        {
          "id": "gamme_mobilier",
          "label": "Gamme du mobilier",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "economique", "label": "Économique", "icon": "circle"},
            {"value": "standard", "label": "Standard", "icon": "square"},
            {"value": "premium", "label": "Premium", "icon": "diamond"}
          ]
        },
        {
          "id": "electromenager",
          "label": "Électroménager inclus ?",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "non", "label": "Non inclus", "icon": "x"},
            {"value": "basique", "label": "Basique (plaque, four, hotte)", "icon": "circle"},
            {"value": "complet", "label": "Complet (+ lave-vaisselle, frigo)", "icon": "check"}
          ]
        }
      ]
    }
  },
  {
    "slug": "renovation-cuisine-moderne",
    "nom": "Rénovation cuisine moderne",
    "description": "Modernisation d'une cuisine existante avec nouveaux équipements",
    "unite_prix": "forfait",
    "prix_marche": {"min": 6000, "max": 18000},
    "base_calcul": {"prix_moyen_unitaire": 12000, "temps_moyen_heures": 80},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Pose mobilier", "impact_prix": 4000}],
    "options": [{"nom": "Crédence sur mesure", "impact_prix": 800}],
    "dependances": ["menuiserie"],
    "questionnaire": {
      "surface_question": "Surface de la cuisine (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "style_cuisine",
          "label": "Style souhaité",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "moderne", "label": "Moderne", "icon": "square"},
            {"value": "classique", "label": "Classique", "icon": "home"},
            {"value": "industriel", "label": "Industriel", "icon": "settings"},
            {"value": "scandinave", "label": "Scandinave", "icon": "circle"}
          ]
        },
        {
          "id": "budget_max",
          "label": "Budget maximum souhaité (€)",
          "type": "number",
          "required": true,
          "min": 5000,
          "max": 30000
        }
      ]
    }
  },
  {
    "slug": "pose-carrelage-sol",
    "nom": "Pose carrelage sol",
    "description": "Pose de carrelage au sol avec préparation support",
    "unite_prix": "m2",
    "prix_marche": {"min": 35, "max": 85},
    "base_calcul": {"prix_moyen_unitaire": 55, "temps_moyen_heures": 8},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Ragréage", "impact_prix": 15}],
    "options": [{"nom": "Carrelage grand format", "impact_prix": 20}],
    "dependances": ["preparation_sol"],
    "questionnaire": {
      "surface_question": "Surface à carreler (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_carrelage",
          "label": "Type de carrelage souhaité",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "ceramique", "label": "Céramique", "icon": "square"},
            {"value": "gres_cerame", "label": "Grès cérame", "icon": "square"},
            {"value": "pierre_naturelle", "label": "Pierre naturelle", "icon": "mountain"},
            {"value": "grand_format", "label": "Grand format", "icon": "maximize"}
          ]
        }
      ]
    }
  },
  {
    "slug": "pose-parquet-flottant",
    "nom": "Pose parquet flottant",
    "description": "Installation de parquet flottant avec sous-couche",
    "unite_prix": "m2",
    "prix_marche": {"min": 25, "max": 65},
    "base_calcul": {"prix_moyen_unitaire": 42, "temps_moyen_heures": 6},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Sous-couche isolante", "impact_prix": 8}],
    "options": [{"nom": "Parquet chêne massif", "impact_prix": 35}],
    "dependances": ["preparation_sol"],
    "questionnaire": {
      "surface_question": "Surface à parqueter (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_parquet",
          "label": "Type de parquet souhaité",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "chene", "label": "Chêne", "icon": "square"},
            {"value": "hetre", "label": "Hêtre", "icon": "square"},
            {"value": "bambou", "label": "Bambou", "icon": "circle"},
            {"value": "stratifie", "label": "Stratifié", "icon": "minus"}
          ]
        },
        {
          "id": "nb_pieces",
          "label": "Nombre de pièces",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 10
        }
      ]
    }
  },
  {
    "slug": "peinture-interieure",
    "nom": "Peinture intérieure",
    "description": "Application de peinture sur murs et plafonds intérieurs",
    "unite_prix": "m2",
    "prix_marche": {"min": 18, "max": 45},
    "base_calcul": {"prix_moyen_unitaire": 28, "temps_moyen_heures": 4},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Préparation supports", "impact_prix": 8}],
    "options": [{"nom": "Peinture haut de gamme", "impact_prix": 12}],
    "dependances": ["preparation_murs"],
    "questionnaire": {
      "surface_question": "Surface à peindre (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "nb_pieces",
          "label": "Nombre de pièces à peindre",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 15
        },
        {
          "id": "hauteur_plafond",
          "label": "Hauteur sous plafond",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "standard", "label": "Standard (2,5m)", "icon": "arrow-up"},
            {"value": "haut", "label": "Haut (3m+)", "icon": "arrow-up-right"}
          ]
        }
      ]
    }
  },
  {
    "slug": "installation-chauffage",
    "nom": "Installation chauffage",
    "description": "Installation système de chauffage central",
    "unite_prix": "forfait",
    "prix_marche": {"min": 3000, "max": 12000},
    "base_calcul": {"prix_moyen_unitaire": 6500, "temps_moyen_heures": 60},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Chaudière gaz", "impact_prix": 2500}],
    "options": [{"nom": "Pompe à chaleur", "impact_prix": 4000}],
    "dependances": ["plomberie", "electricite"],
    "questionnaire": {
      "surface_question": "Surface à chauffer (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_chauffage",
          "label": "Type de chauffage souhaité",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "gaz", "label": "Chaudière gaz", "icon": "circle"},
            {"value": "pompe_chaleur", "label": "Pompe à chaleur", "icon": "arrow-up"},
            {"value": "electrique", "label": "Électrique", "icon": "zap"},
            {"value": "bois", "label": "Poêle à bois", "icon": "square"}
          ]
        },
        {
          "id": "nb_radiateurs",
          "label": "Nombre de radiateurs nécessaires",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 20
        }
      ]
    }
  },
  {
    "slug": "isolation-combles",
    "nom": "Isolation combles",
    "description": "Isolation thermique des combles perdus ou aménagés",
    "unite_prix": "m2",
    "prix_marche": {"min": 20, "max": 60},
    "base_calcul": {"prix_moyen_unitaire": 35, "temps_moyen_heures": 4},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Pare-vapeur", "impact_prix": 8}],
    "options": [{"nom": "Isolation renforcée R=10", "impact_prix": 18}],
    "dependances": ["charpente"],
    "questionnaire": {
      "surface_question": "Surface des combles (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_combles",
          "label": "Type de combles",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "perdus", "label": "Combles perdus", "icon": "minus"},
            {"value": "amenages", "label": "Combles aménagés", "icon": "home"},
            {"value": "amenageables", "label": "Combles aménageables", "icon": "square"}
          ]
        },
        {
          "id": "hauteur_combles",
          "label": "Hauteur sous charpente (cm)",
          "type": "number",
          "required": true,
          "min": 100,
          "max": 300
        }
      ]
    }
  },
  {
    "slug": "ravalement-facade",
    "nom": "Ravalement façade",
    "description": "Ravalement complet de façade avec enduit",
    "unite_prix": "m2",
    "prix_marche": {"min": 45, "max": 120},
    "base_calcul": {"prix_moyen_unitaire": 75, "temps_moyen_heures": 8},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Nettoyage façade", "impact_prix": 12}],
    "options": [{"nom": "Isolation par l'extérieur", "impact_prix": 80}],
    "dependances": ["echafaudage"],
    "questionnaire": {
      "surface_question": "Surface de façade (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "etat_facade",
          "label": "État actuel de la façade",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "bon", "label": "Bon état", "icon": "circle"},
            {"value": "moyen", "label": "État moyen", "icon": "minus"},
            {"value": "mauvais", "label": "Mauvais état", "icon": "square"}
          ]
        },
        {
          "id": "nb_etages",
          "label": "Nombre d'étages",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 5
        }
      ]
    }
  },
  {
    "slug": "renovation-complete-salle-bain",
    "nom": "Rénovation complète salle de bain",
    "description": "Rénovation complète salle de bain avec sanitaires",
    "unite_prix": "forfait",
    "prix_marche": {"min": 6000, "max": 20000},
    "base_calcul": {"prix_moyen_unitaire": 12000, "temps_moyen_heures": 100},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Démolition", "impact_prix": 1200}, {"nom": "Étanchéité", "impact_prix": 800}],
    "options": [{"nom": "Douche italienne", "impact_prix": 2000}],
    "dependances": ["plomberie", "electricite", "carrelage"],
    "questionnaire": {
      "surface_question": "Surface de la salle de bain (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_douche",
          "label": "Type de douche souhaité",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "classique", "label": "Douche classique", "icon": "square"},
            {"value": "italienne", "label": "Douche italienne", "icon": "minus"},
            {"value": "baignoire", "label": "Baignoire", "icon": "circle"},
            {"value": "mixte", "label": "Baignoire + douche", "icon": "maximize"}
          ]
        },
        {
          "id": "gamme_sanitaires",
          "label": "Gamme des sanitaires",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "standard", "label": "Standard", "icon": "circle"},
            {"value": "milieu", "label": "Milieu de gamme", "icon": "arrow-up"},
            {"value": "haut", "label": "Haut de gamme", "icon": "arrow-up-right"}
          ]
        }
      ]
    }
  },
  {
    "slug": "installation-douche-italienne",
    "nom": "Installation douche italienne",
    "description": "Création douche à l'italienne avec évacuation",
    "unite_prix": "forfait",
    "prix_marche": {"min": 1800, "max": 5000},
    "base_calcul": {"prix_moyen_unitaire": 3200, "temps_moyen_heures": 25},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Création pente", "impact_prix": 600}, {"nom": "Évacuation linéaire", "impact_prix": 350}],
    "options": [{"nom": "Carrelage antidérapant", "impact_prix": 200}],
    "dependances": ["plomberie", "carrelage"],
    "questionnaire": {
      "surface_question": "Surface de la douche (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "taille_douche",
          "label": "Taille de la douche",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "standard", "label": "Standard (90x90)", "icon": "square"},
            {"value": "large", "label": "Large (120x90)", "icon": "maximize"},
            {"value": "xxl", "label": "XXL (140x90)", "icon": "arrow-up-right"}
          ]
        },
        {
          "id": "type_evacuation",
          "label": "Type d'évacuation",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "centrale", "label": "Centrale", "icon": "circle"},
            {"value": "lineaire", "label": "Linéaire", "icon": "minus"}
          ]
        }
      ]
    }
  },
  {
    "slug": "pose-parquet-massif",
    "nom": "Pose parquet massif",
    "description": "Installation parquet massif cloué ou collé",
    "unite_prix": "m2",
    "prix_marche": {"min": 45, "max": 120},
    "base_calcul": {"prix_moyen_unitaire": 75, "temps_moyen_heures": 10},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Lambourdes", "impact_prix": 15}, {"nom": "Isolation phonique", "impact_prix": 12}],
    "options": [{"nom": "Parquet point de Hongrie", "impact_prix": 40}],
    "dependances": ["preparation_sol"],
    "questionnaire": {
      "surface_question": "Surface à parqueter (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "essence_bois",
          "label": "Essence de bois souhaitée",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "chene", "label": "Chêne", "icon": "square"},
            {"value": "hetre", "label": "Hêtre", "icon": "circle"},
            {"value": "frene", "label": "Frêne", "icon": "minus"},
            {"value": "noyer", "label": "Noyer", "icon": "mountain"}
          ]
        },
        {
          "id": "finition",
          "label": "Type de finition",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "brut", "label": "Brut à poncer", "icon": "square"},
            {"value": "huile", "label": "Huilé", "icon": "circle"},
            {"value": "vernis", "label": "Vernis", "icon": "arrow-up"}
          ]
        }
      ]
    }
  },
  {
    "slug": "renovation-toiture",
    "nom": "Rénovation toiture",
    "description": "Réfection complète de toiture avec couverture",
    "unite_prix": "m2",
    "prix_marche": {"min": 80, "max": 200},
    "base_calcul": {"prix_moyen_unitaire": 130, "temps_moyen_heures": 12},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Dépose ancienne couverture", "impact_prix": 25}, {"nom": "Liteaux neufs", "impact_prix": 18}],
    "options": [{"nom": "Tuiles terre cuite", "impact_prix": 35}],
    "dependances": ["charpente", "echafaudage"],
    "questionnaire": {
      "surface_question": "Surface de toiture (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_couverture",
          "label": "Type de couverture souhaité",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "tuile", "label": "Tuiles", "icon": "square"},
            {"value": "ardoise", "label": "Ardoise", "icon": "mountain"},
            {"value": "zinc", "label": "Zinc", "icon": "minus"}
          ]
        },
        {
          "id": "pente_toiture",
          "label": "Pente de la toiture",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "faible", "label": "Faible (<30°)", "icon": "minus"},
            {"value": "moyenne", "label": "Moyenne (30-45°)", "icon": "arrow-up"},
            {"value": "forte", "label": "Forte (>45°)", "icon": "arrow-up-right"}
          ]
        }
      ]
    }
  },
  {
    "slug": "charpente-traditionnelle",
    "nom": "Charpente traditionnelle",
    "description": "Construction charpente bois traditionnelle",
    "unite_prix": "m2",
    "prix_marche": {"min": 60, "max": 150},
    "base_calcul": {"prix_moyen_unitaire": 95, "temps_moyen_heures": 15},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Traitement bois", "impact_prix": 12}, {"nom": "Assemblages traditionnels", "impact_prix": 25}],
    "options": [{"nom": "Chêne massif", "impact_prix": 50}],
    "dependances": ["maconnerie"],
    "questionnaire": {
      "surface_question": "Surface de charpente (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_charpente",
          "label": "Type de charpente",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "traditionnelle", "label": "Traditionnelle", "icon": "square"},
            {"value": "fermette", "label": "Fermette", "icon": "minus"},
            {"value": "lamelle_colle", "label": "Lamellé-collé", "icon": "maximize"}
          ]
        },
        {
          "id": "portee",
          "label": "Portée maximale (m)",
          "type": "number",
          "required": true,
          "min": 3,
          "max": 15
        }
      ]
    }
  },
  {
    "slug": "couverture-tuiles",
    "nom": "Couverture tuiles",
    "description": "Pose ou réfection couverture en tuiles avec faîtage",
    "unite_prix": "m2",
    "prix_marche": {"min": 45, "max": 120},
    "base_calcul": {"prix_moyen_unitaire": 75, "temps_moyen_heures": 8},
    "multiplicateurs_gamme": {"economique": 0.8, "standard": 1, "premium": 1.5},
    "multiplicateurs_etat": {"neuf": 1, "renovation": 1.2, "renovation_lourde": 1.4},
    "sous_prestations": [{"nom": "Liteaux et contre-liteaux", "impact_prix": 12}, {"nom": "Écran sous-toiture", "impact_prix": 8}],
    "options": [{"nom": "Faîtage ventilé", "impact_prix": 15}, {"nom": "Tuiles terre cuite premium", "impact_prix": 25}],
    "dependances": ["charpente", "echafaudage"],
    "questionnaire": {
      "surface_question": "Surface de couverture (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_tuiles",
          "label": "Type de tuiles souhaité",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "mecanique", "label": "Tuiles mécaniques", "icon": "square"},
            {"value": "terre_cuite", "label": "Tuiles terre cuite", "icon": "circle"},
            {"value": "beton", "label": "Tuiles béton", "icon": "minus"},
            {"value": "ardoise", "label": "Ardoise naturelle", "icon": "diamond"}
          ]
        },
        {
          "id": "pente_toit",
          "label": "Pente du toit (degrés)",
          "type": "number",
          "required": true,
          "min": 15,
          "max": 60
        },
        {
          "id": "options_couverture",
          "label": "Options souhaitées",
          "type": "cards",
          "required": false,
          "options": [
            {"value": "faitage", "label": "Faîtage ventilé", "icon": "arrow-up"},
            {"value": "gouttieres", "label": "Gouttières neuves", "icon": "droplets"},
            {"value": "isolation", "label": "Isolation sous-toiture", "icon": "shield"}
          ]
        }
      ]
    }
  },
  {
    "slug": "zinguerie-complete",
    "nom": "Zinguerie complète",
    "description": "Installation complète zinguerie : gouttières, descentes, chéneaux",
    "unite_prix": "ml",
    "prix_marche": {"min": 35, "max": 85},
    "base_calcul": {"prix_moyen_unitaire": 55, "temps_moyen_heures": 4},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.3},
    "multiplicateurs_etat": {"neuf": 1, "renovation": 1.1, "renovation_lourde": 1.2},
    "sous_prestations": [{"nom": "Supports et fixations", "impact_prix": 8}, {"nom": "Raccords et coudes", "impact_prix": 12}],
    "options": [{"nom": "Zinc prépatiné", "impact_prix": 20}, {"nom": "Crapaudines et grilles", "impact_prix": 5}],
    "dependances": ["couverture"],
    "questionnaire": {
      "surface_question": "Longueur de zinguerie (ml)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_zinguerie",
          "label": "Type de zinguerie",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "pvc", "label": "PVC", "icon": "circle"},
            {"value": "zinc", "label": "Zinc", "icon": "square"},
            {"value": "alu", "label": "Aluminium", "icon": "minus"},
            {"value": "cuivre", "label": "Cuivre", "icon": "diamond"}
          ]
        },
        {
          "id": "elements_zinguerie",
          "label": "Éléments à installer",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "gouttieres", "label": "Gouttières", "icon": "minus"},
            {"value": "descentes", "label": "Tuyaux de descente", "icon": "arrow-down"},
            {"value": "cheneaux", "label": "Chéneaux", "icon": "square"},
            {"value": "noues", "label": "Noues", "icon": "corner-down-right"}
          ]
        }
      ]
    }
  },
  {
    "slug": "remplacement-gouttieres",
    "nom": "Remplacement gouttières",
    "description": "Remplacement gouttières et tuyaux de descente existants",
    "unite_prix": "ml",
    "prix_marche": {"min": 25, "max": 65},
    "base_calcul": {"prix_moyen_unitaire": 40, "temps_moyen_heures": 3},
    "multiplicateurs_gamme": {"economique": 0.8, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 1, "renovation": 1, "renovation_lourde": 1.1},
    "sous_prestations": [{"nom": "Dépose ancienne zinguerie", "impact_prix": 8}],
    "options": [{"nom": "Récupérateur d'eau", "impact_prix": 150}],
    "dependances": ["echafaudage"],
    "questionnaire": {
      "surface_question": "Longueur de gouttières (ml)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "materiau_gouttieres",
          "label": "Matériau souhaité",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "pvc", "label": "PVC", "icon": "circle"},
            {"value": "zinc", "label": "Zinc", "icon": "square"},
            {"value": "alu", "label": "Aluminium", "icon": "minus"}
          ]
        },
        {
          "id": "nb_descentes",
          "label": "Nombre de descentes",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 8
        }
      ]
    }
  },
  {
    "slug": "creation-charpente-neuve",
    "nom": "Création charpente neuve",
    "description": "Construction charpente bois neuve pour extension ou construction",
    "unite_prix": "m2",
    "prix_marche": {"min": 60, "max": 150},
    "base_calcul": {"prix_moyen_unitaire": 95, "temps_moyen_heures": 10},
    "multiplicateurs_gamme": {"economique": 0.8, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 1, "renovation": 1.1, "renovation_lourde": 1.2},
    "sous_prestations": [{"nom": "Bois de charpente", "impact_prix": 35}, {"nom": "Assemblages métalliques", "impact_prix": 15}],
    "options": [{"nom": "Traitement insecticide/fongicide", "impact_prix": 8}, {"nom": "Bois lamellé-collé", "impact_prix": 25}],
    "dependances": ["maconnerie"],
    "questionnaire": {
      "surface_question": "Surface de charpente (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_charpente_neuve",
          "label": "Type de charpente",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "traditionnelle", "label": "Traditionnelle", "icon": "square"},
            {"value": "fermettes", "label": "Fermettes industrielles", "icon": "triangle"},
            {"value": "lamelle_colle", "label": "Lamellé-collé", "icon": "layers"}
          ]
        },
        {
          "id": "portee_charpente",
          "label": "Portée maximale (mètres)",
          "type": "number",
          "required": true,
          "min": 3,
          "max": 20
        },
        {
          "id": "complexite_charpente",
          "label": "Complexité de la charpente",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "simple", "label": "Simple (2 pans)", "icon": "minus"},
            {"value": "moyenne", "label": "Moyenne (4 pans)", "icon": "square"},
            {"value": "complexe", "label": "Complexe (multi-pans)", "icon": "hexagon"}
          ]
        }
      ]
    }
  },
  {
    "slug": "reparation-charpente",
    "nom": "Réparation charpente",
    "description": "Réparation et renforcement charpente existante",
    "unite_prix": "forfait",
    "prix_marche": {"min": 1500, "max": 8000},
    "base_calcul": {"prix_moyen_unitaire": 4000, "temps_moyen_heures": 25},
    "multiplicateurs_gamme": {"economique": 0.8, "standard": 1, "premium": 1.3},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.4},
    "sous_prestations": [{"nom": "Diagnostic charpente", "impact_prix": 300}, {"nom": "Traitement curatif", "impact_prix": 800}],
    "options": [{"nom": "Renforcement par poutres métalliques", "impact_prix": 1200}],
    "dependances": ["echafaudage"],
    "questionnaire": {
      "surface_question": "Surface concernée (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "probleme_charpente",
          "label": "Problème constaté",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "insectes", "label": "Insectes xylophages", "icon": "bug"},
            {"value": "humidite", "label": "Dégâts d'humidité", "icon": "droplets"},
            {"value": "affaissement", "label": "Affaissement", "icon": "arrow-down"},
            {"value": "fissures", "label": "Fissures", "icon": "zap"}
          ]
        },
        {
          "id": "etendue_degats",
          "label": "Étendue des dégâts",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "localisee", "label": "Localisée", "icon": "circle"},
            {"value": "moyenne", "label": "Moyenne", "icon": "square"},
            {"value": "importante", "label": "Importante", "icon": "hexagon"}
          ]
        }
      ]
    }
  },
  {
    "slug": "pose-faitage",
    "nom": "Pose faîtage",
    "description": "Installation ou réfection faîtage de toiture avec ventilation",
    "unite_prix": "ml",
    "prix_marche": {"min": 25, "max": 65},
    "base_calcul": {"prix_moyen_unitaire": 40, "temps_moyen_heures": 3},
    "multiplicateurs_gamme": {"economique": 0.8, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 1, "renovation": 1.1, "renovation_lourde": 1.2},
    "sous_prestations": [{"nom": "Mortier de scellement", "impact_prix": 5}],
    "options": [{"nom": "Faîtage ventilé", "impact_prix": 15}, {"nom": "Closoirs d'about", "impact_prix": 8}],
    "dependances": ["couverture"],
    "questionnaire": {
      "surface_question": "Longueur de faîtage (ml)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_faitage",
          "label": "Type de faîtage",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "tuiles", "label": "Tuiles faîtières", "icon": "square"},
            {"value": "zinc", "label": "Faîtage zinc", "icon": "minus"},
            {"value": "ventile", "label": "Faîtage ventilé", "icon": "wind"}
          ]
        },
        {
          "id": "ventilation_faitage",
          "label": "Ventilation souhaitée",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "oui", "label": "Avec ventilation", "icon": "wind"},
            {"value": "non", "label": "Sans ventilation", "icon": "x"}
          ]
        }
      ]
    }
  },
  {
    "slug": "etancheite-toiture-terrasse",
    "nom": "Étanchéité toiture terrasse",
    "description": "Étanchéité membrane EPDM ou bitume pour toit plat",
    "unite_prix": "m2",
    "prix_marche": {"min": 35, "max": 85},
    "base_calcul": {"prix_moyen_unitaire": 55, "temps_moyen_heures": 6},
    "multiplicateurs_gamme": {"economique": 0.8, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 1, "renovation": 1.2, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Préparation support", "impact_prix": 12}, {"nom": "Isolation thermique", "impact_prix": 20}],
    "options": [{"nom": "Membrane EPDM", "impact_prix": 15}, {"nom": "Protection gravillons", "impact_prix": 8}],
    "dependances": ["isolation"],
    "questionnaire": {
      "surface_question": "Surface de toiture terrasse (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_membrane",
          "label": "Type de membrane",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "epdm", "label": "EPDM", "icon": "square"},
            {"value": "bitume", "label": "Bitume", "icon": "circle"},
            {"value": "pvc", "label": "PVC", "icon": "minus"}
          ]
        },
        {
          "id": "usage_terrasse",
          "label": "Usage de la terrasse",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "non_accessible", "label": "Non accessible", "icon": "x"},
            {"value": "technique", "label": "Technique", "icon": "settings"},
            {"value": "accessible", "label": "Accessible", "icon": "check"}
          ]
        }
      ]
    }
  },
  {
    "slug": "installation-pompe-chaleur",
    "nom": "Installation pompe à chaleur",
    "description": "Installation PAC air/eau ou géothermique",
    "unite_prix": "forfait",
    "prix_marche": {"min": 8000, "max": 18000},
    "base_calcul": {"prix_moyen_unitaire": 12000, "temps_moyen_heures": 40},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Unité extérieure", "impact_prix": 3000}, {"nom": "Raccordements frigorifiques", "impact_prix": 800}],
    "options": [{"nom": "PAC géothermique", "impact_prix": 8000}],
    "dependances": ["electricite", "plomberie"],
    "questionnaire": {
      "surface_question": "Surface à chauffer (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_pac",
          "label": "Type de pompe à chaleur",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "air_eau", "label": "Air/Eau", "icon": "circle"},
            {"value": "air_air", "label": "Air/Air", "icon": "arrow-up"},
            {"value": "geothermie", "label": "Géothermie", "icon": "mountain"}
          ]
        },
        {
          "id": "puissance",
          "label": "Puissance estimée (kW)",
          "type": "number",
          "required": true,
          "min": 5,
          "max": 30
        }
      ]
    }
  },
  {
    "slug": "renovation-electricite",
    "nom": "Rénovation électricité",
    "description": "Mise aux normes installation électrique complète",
    "unite_prix": "forfait",
    "prix_marche": {"min": 3000, "max": 8000},
    "base_calcul": {"prix_moyen_unitaire": 5000, "temps_moyen_heures": 50},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Tableau électrique", "impact_prix": 800}, {"nom": "Mise à la terre", "impact_prix": 400}],
    "options": [{"nom": "Domotique intégrée", "impact_prix": 2000}],
    "dependances": ["gros_oeuvre"],
    "questionnaire": {
      "surface_question": "Surface du logement (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "nb_pieces",
          "label": "Nombre de pièces",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 15
        },
        {
          "id": "type_renovation",
          "label": "Type de rénovation électrique",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "partielle", "label": "Partielle", "icon": "circle"},
            {"value": "complete", "label": "Complète", "icon": "square"},
            {"value": "mise_normes", "label": "Mise aux normes", "icon": "arrow-up"}
          ]
        }
      ]
    }
  },
  {
    "slug": "renovation-plomberie",
    "nom": "Rénovation plomberie",
    "description": "Rénovation complète réseau plomberie",
    "unite_prix": "forfait",
    "prix_marche": {"min": 2500, "max": 6000},
    "base_calcul": {"prix_moyen_unitaire": 4000, "temps_moyen_heures": 40},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Évacuations PVC", "impact_prix": 800}, {"nom": "Arrivées PER", "impact_prix": 600}],
    "options": [{"nom": "Adoucisseur d'eau", "impact_prix": 1200}],
    "dependances": ["gros_oeuvre"],
    "questionnaire": {
      "surface_question": "Surface du logement (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "nb_points_eau",
          "label": "Nombre de points d'eau",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 20
        },
        {
          "id": "type_travaux",
          "label": "Type de travaux plomberie",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "renovation", "label": "Rénovation", "icon": "circle"},
            {"value": "creation", "label": "Création", "icon": "square"},
            {"value": "reparation", "label": "Réparation", "icon": "arrow-up"}
          ]
        }
      ]
    }
  },
  {
    "slug": "amenagement-piscine",
    "nom": "Aménagement piscine",
    "description": "Construction piscine enterrée avec équipements",
    "unite_prix": "forfait",
    "prix_marche": {"min": 15000, "max": 50000},
    "base_calcul": {"prix_moyen_unitaire": 28000, "temps_moyen_heures": 200},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Terrassement", "impact_prix": 3000}, {"nom": "Filtration", "impact_prix": 2500}],
    "options": [{"nom": "Piscine à débordement", "impact_prix": 15000}],
    "dependances": ["terrassement", "electricite", "plomberie"],
    "questionnaire": {
      "surface_question": "Surface de la piscine (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_piscine",
          "label": "Type de piscine",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "enterree", "label": "Enterrée", "icon": "square"},
            {"value": "semi_enterree", "label": "Semi-enterrée", "icon": "minus"},
            {"value": "hors_sol", "label": "Hors-sol", "icon": "circle"}
          ]
        },
        {
          "id": "profondeur",
          "label": "Profondeur souhaitée (m)",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 3
        }
      ]
    }
  },
  {
    "slug": "creation-terrasse-bois",
    "nom": "Création terrasse bois",
    "description": "Construction terrasse bois sur plots ou lambourdes",
    "unite_prix": "m2",
    "prix_marche": {"min": 40, "max": 120},
    "base_calcul": {"prix_moyen_unitaire": 75, "temps_moyen_heures": 6},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Structure lambourdes", "impact_prix": 20}, {"nom": "Plots réglables", "impact_prix": 15}],
    "options": [{"nom": "Bois exotique", "impact_prix": 35}],
    "dependances": ["terrassement"],
    "questionnaire": {
      "surface_question": "Surface de la terrasse (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_bois",
          "label": "Type de bois",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "pin", "label": "Pin autoclave", "icon": "square"},
            {"value": "composite", "label": "Composite", "icon": "circle"},
            {"value": "exotique", "label": "Bois exotique", "icon": "mountain"}
          ]
        },
        {
          "id": "hauteur_terrasse",
          "label": "Hauteur de la terrasse (cm)",
          "type": "number",
          "required": true,
          "min": 10,
          "max": 200
        }
      ]
    }
  },
  {
    "slug": "pose-cloture",
    "nom": "Pose clôture",
    "description": "Installation clôture rigide ou grillage",
    "unite_prix": "ml",
    "prix_marche": {"min": 25, "max": 80},
    "base_calcul": {"prix_moyen_unitaire": 45, "temps_moyen_heures": 2},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Poteaux béton", "impact_prix": 12}, {"nom": "Scellement chimique", "impact_prix": 8}],
    "options": [{"nom": "Portail assorti", "impact_prix": 800}],
    "dependances": ["terrassement"],
    "questionnaire": {
      "surface_question": "Longueur de clôture (mètres linéaires)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_cloture",
          "label": "Type de clôture",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "grillage", "label": "Grillage rigide", "icon": "square"},
            {"value": "pvc", "label": "PVC", "icon": "minus"},
            {"value": "bois", "label": "Bois", "icon": "circle"},
            {"value": "alu", "label": "Aluminium", "icon": "maximize"}
          ]
        },
        {
          "id": "hauteur_cloture",
          "label": "Hauteur souhaitée (cm)",
          "type": "number",
          "required": true,
          "min": 80,
          "max": 250
        }
      ]
    }
  },
  {
    "slug": "installation-portail",
    "nom": "Installation portail",
    "description": "Pose portail battant ou coulissant avec motorisation",
    "unite_prix": "unite",
    "prix_marche": {"min": 800, "max": 3500},
    "base_calcul": {"prix_moyen_unitaire": 1800, "temps_moyen_heures": 8},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Piliers maçonnés", "impact_prix": 400}, {"nom": "Motorisation", "impact_prix": 600}],
    "options": [{"nom": "Portail sur mesure", "impact_prix": 1000}],
    "dependances": ["maconnerie", "electricite"],
    "questionnaire": {
      "surface_question": "Largeur du portail (mètres)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_portail",
          "label": "Type de portail",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "battant", "label": "Battant", "icon": "arrow-up-right"},
            {"value": "coulissant", "label": "Coulissant", "icon": "minus"},
            {"value": "pliable", "label": "Pliable", "icon": "square"}
          ]
        },
        {
          "id": "materiau_portail",
          "label": "Matériau du portail",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "alu", "label": "Aluminium", "icon": "square"},
            {"value": "pvc", "label": "PVC", "icon": "circle"},
            {"value": "fer", "label": "Fer forgé", "icon": "mountain"},
            {"value": "bois", "label": "Bois", "icon": "arrow-up"}
          ]
        }
      ]
    }
  },
  {
    "slug": "pose-fenetres-pvc",
    "nom": "Pose fenêtres PVC",
    "description": "Installation fenêtres PVC double vitrage",
    "unite_prix": "unite",
    "prix_marche": {"min": 300, "max": 800},
    "base_calcul": {"prix_moyen_unitaire": 500, "temps_moyen_heures": 4},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Dépose ancienne", "impact_prix": 80}, {"nom": "Habillage tableau", "impact_prix": 60}],
    "options": [{"nom": "Triple vitrage", "impact_prix": 150}],
    "dependances": ["menuiserie"],
    "questionnaire": {
      "surface_question": "Nombre de fenêtres",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_fenetre",
          "label": "Type de fenêtres",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "standard", "label": "Standard", "icon": "square"},
            {"value": "oscillo_battant", "label": "Oscillo-battant", "icon": "arrow-up"},
            {"value": "coulissant", "label": "Coulissant", "icon": "minus"},
            {"value": "fixe", "label": "Fixe", "icon": "circle"}
          ]
        },
        {
          "id": "vitrage",
          "label": "Type de vitrage",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "double", "label": "Double vitrage", "icon": "square"},
            {"value": "triple", "label": "Triple vitrage", "icon": "maximize"}
          ]
        }
      ]
    }
  },
  {
    "slug": "entretien-jardin",
    "nom": "Entretien jardin",
    "description": "Entretien complet espaces verts et jardins",
    "unite_prix": "forfait",
    "prix_marche": {"min": 200, "max": 800},
    "base_calcul": {"prix_moyen_unitaire": 400, "temps_moyen_heures": 8},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Tonte pelouse", "impact_prix": 80}, {"nom": "Taille haies", "impact_prix": 120}],
    "options": [{"nom": "Traitement phytosanitaire", "impact_prix": 150}],
    "dependances": ["paysagisme"],
    "questionnaire": {
      "surface_question": "Surface du jardin (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "frequence_entretien",
          "label": "Fréquence d'entretien souhaitée",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "hebdomadaire", "label": "Hebdomadaire", "icon": "circle"},
            {"value": "mensuelle", "label": "Mensuelle", "icon": "square"},
            {"value": "saisonniere", "label": "Saisonnière", "icon": "minus"}
          ]
        },
        {
          "id": "type_jardin",
          "label": "Type de jardin",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "pelouse", "label": "Principalement pelouse", "icon": "circle"},
            {"value": "massifs", "label": "Massifs et arbustes", "icon": "mountain"},
            {"value": "potager", "label": "Potager", "icon": "square"}
          ]
        }
      ]
    }
  },
  {
    "slug": "taille-haies",
    "nom": "Taille haies",
    "description": "Taille et entretien haies et arbustes",
    "unite_prix": "ml",
    "prix_marche": {"min": 8, "max": 25},
    "base_calcul": {"prix_moyen_unitaire": 15, "temps_moyen_heures": 1},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Évacuation déchets verts", "impact_prix": 3}],
    "options": [{"nom": "Taille architecturée", "impact_prix": 8}],
    "dependances": ["paysagisme"],
    "questionnaire": {
      "surface_question": "Longueur de haies (mètres linéaires)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_haie",
          "label": "Type de haie",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "thuya", "label": "Thuya", "icon": "arrow-up"},
            {"value": "laurier", "label": "Laurier", "icon": "circle"},
            {"value": "troene", "label": "Troène", "icon": "square"},
            {"value": "mixte", "label": "Haie mixte", "icon": "mountain"}
          ]
        },
        {
          "id": "hauteur_haie",
          "label": "Hauteur de la haie (m)",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 5
        }
      ]
    }
  },
  {
    "slug": "tonte-pelouse",
    "nom": "Tonte pelouse",
    "description": "Tonte et entretien pelouse avec ramassage",
    "unite_prix": "m2",
    "prix_marche": {"min": 0.5, "max": 2},
    "base_calcul": {"prix_moyen_unitaire": 1, "temps_moyen_heures": 2},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Bordures", "impact_prix": 0.3}],
    "options": [{"nom": "Mulching", "impact_prix": 0.2}],
    "dependances": ["paysagisme"],
    "questionnaire": {
      "surface_question": "Surface de pelouse (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_tonte",
          "label": "Type de tonte",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "simple", "label": "Tonte simple", "icon": "circle"},
            {"value": "mulching", "label": "Mulching", "icon": "square"},
            {"value": "ramassage", "label": "Avec ramassage", "icon": "arrow-up"}
          ]
        },
        {
          "id": "frequence_tonte",
          "label": "Fréquence souhaitée",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "hebdo", "label": "Hebdomadaire", "icon": "circle"},
            {"value": "bi_mensuel", "label": "Bi-mensuelle", "icon": "minus"}
          ]
        }
      ]
    }
  },
  {
    "slug": "dallage-exterieur",
    "nom": "Dallage extérieur",
    "description": "Pose dallage pierre naturelle ou béton",
    "unite_prix": "m2",
    "prix_marche": {"min": 30, "max": 100},
    "base_calcul": {"prix_moyen_unitaire": 60, "temps_moyen_heures": 6},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Lit de sable", "impact_prix": 8}, {"nom": "Joints sable polymère", "impact_prix": 5}],
    "options": [{"nom": "Pierre naturelle", "impact_prix": 40}],
    "dependances": ["terrassement"],
    "questionnaire": {
      "surface_question": "Surface à daller (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_dalle",
          "label": "Type de dallage",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "beton", "label": "Béton", "icon": "square"},
            {"value": "pierre_naturelle", "label": "Pierre naturelle", "icon": "mountain"},
            {"value": "dalle_gres", "label": "Dalle grès", "icon": "circle"},
            {"value": "pave", "label": "Pavés", "icon": "minus"}
          ]
        },
        {
          "id": "usage_terrasse",
          "label": "Usage principal",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "terrasse", "label": "Terrasse", "icon": "circle"},
            {"value": "allee", "label": "Allée", "icon": "minus"},
            {"value": "cour", "label": "Cour", "icon": "square"}
          ]
        }
      ]
    }
  },
  {
    "slug": "maconnerie-generale",
    "nom": "Maçonnerie générale",
    "description": "Travaux de maçonnerie tous corps d'état",
    "unite_prix": "forfait",
    "prix_marche": {"min": 2000, "max": 8000},
    "base_calcul": {"prix_moyen_unitaire": 4500, "temps_moyen_heures": 60},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Fondations", "impact_prix": 1500}, {"nom": "Élévation murs", "impact_prix": 2000}],
    "options": [{"nom": "Mur en pierre", "impact_prix": 3000}],
    "dependances": ["terrassement"],
    "questionnaire": {
      "surface_question": "Surface de maçonnerie (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_maconnerie",
          "label": "Type de maçonnerie",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "parpaing", "label": "Parpaing", "icon": "square"},
            {"value": "brique", "label": "Brique", "icon": "circle"},
            {"value": "pierre", "label": "Pierre", "icon": "mountain"},
            {"value": "beton", "label": "Béton banché", "icon": "minus"}
          ]
        },
        {
          "id": "hauteur_mur",
          "label": "Hauteur du mur (m)",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 8
        }
      ]
    }
  },
  {
    "slug": "demolition",
    "nom": "Démolition",
    "description": "Démolition partielle ou complète avec évacuation",
    "unite_prix": "m3",
    "prix_marche": {"min": 40, "max": 120},
    "base_calcul": {"prix_moyen_unitaire": 75, "temps_moyen_heures": 8},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Évacuation gravats", "impact_prix": 25}],
    "options": [{"nom": "Tri sélectif", "impact_prix": 15}],
    "dependances": ["gros_oeuvre"],
    "questionnaire": {
      "surface_question": "Volume à démolir (m³)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_demolition",
          "label": "Type de démolition",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "cloison", "label": "Cloison", "icon": "minus"},
            {"value": "mur_porteur", "label": "Mur porteur", "icon": "square"},
            {"value": "batiment", "label": "Bâtiment complet", "icon": "mountain"}
          ]
        },
        {
          "id": "acces_chantier",
          "label": "Accès au chantier",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "facile", "label": "Facile", "icon": "circle"},
            {"value": "difficile", "label": "Difficile", "icon": "square"}
          ]
        }
      ]
    }
  },
  {
    "slug": "extension-maison",
    "nom": "Extension maison",
    "description": "Construction extension tous corps d'état",
    "unite_prix": "m2",
    "prix_marche": {"min": 1200, "max": 2500},
    "base_calcul": {"prix_moyen_unitaire": 1800, "temps_moyen_heures": 100},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Gros œuvre", "impact_prix": 800}, {"nom": "Second œuvre", "impact_prix": 600}],
    "options": [{"nom": "Toit terrasse", "impact_prix": 400}],
    "dependances": ["maconnerie", "charpente", "couverture"],
    "questionnaire": {
      "surface_question": "Surface d'extension (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_extension",
          "label": "Type d'extension",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "plain_pied", "label": "Plain-pied", "icon": "minus"},
            {"value": "etage", "label": "Avec étage", "icon": "arrow-up"},
            {"value": "veranda", "label": "Véranda", "icon": "circle"}
          ]
        },
        {
          "id": "usage_extension",
          "label": "Usage prévu",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "salon", "label": "Salon/séjour", "icon": "circle"},
            {"value": "chambre", "label": "Chambre", "icon": "square"},
            {"value": "cuisine", "label": "Cuisine", "icon": "mountain"},
            {"value": "bureau", "label": "Bureau", "icon": "arrow-up"}
          ]
        }
      ]
    }
  },
  {
    "slug": "amenagement-combles",
    "nom": "Aménagement combles",
    "description": "Aménagement combles perdus en espace habitable",
    "unite_prix": "m2",
    "prix_marche": {"min": 500, "max": 1200},
    "base_calcul": {"prix_moyen_unitaire": 800, "temps_moyen_heures": 20},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Plancher", "impact_prix": 200}, {"nom": "Isolation", "impact_prix": 150}],
    "options": [{"nom": "Velux", "impact_prix": 600}],
    "dependances": ["charpente", "electricite"],
    "questionnaire": {
      "surface_question": "Surface des combles (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "usage_combles",
          "label": "Usage prévu des combles",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "chambre", "label": "Chambre", "icon": "circle"},
            {"value": "bureau", "label": "Bureau", "icon": "square"},
            {"value": "salle_jeux", "label": "Salle de jeux", "icon": "arrow-up"},
            {"value": "rangement", "label": "Rangement", "icon": "minus"}
          ]
        },
        {
          "id": "nb_velux",
          "label": "Nombre de Velux souhaités",
          "type": "number",
          "required": true,
          "min": 0,
          "max": 8
        }
      ]
    }
  },
  {
    "slug": "pose-velux",
    "nom": "Pose Velux",
    "description": "Installation fenêtre de toit Velux avec raccords",
    "unite_prix": "unite",
    "prix_marche": {"min": 400, "max": 1000},
    "base_calcul": {"prix_moyen_unitaire": 650, "temps_moyen_heures": 6},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Raccords étanchéité", "impact_prix": 120}],
    "options": [{"nom": "Velux électrique", "impact_prix": 300}],
    "dependances": ["couverture", "charpente"],
    "questionnaire": {
      "surface_question": "Nombre de Velux",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "taille_velux",
          "label": "Taille des Velux",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "78x98", "label": "78x98 cm", "icon": "square"},
            {"value": "78x118", "label": "78x118 cm", "icon": "minus"},
            {"value": "114x118", "label": "114x118 cm", "icon": "maximize"}
          ]
        },
        {
          "id": "type_ouverture",
          "label": "Type d'ouverture",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "manuel", "label": "Manuel", "icon": "circle"},
            {"value": "electrique", "label": "Électrique", "icon": "arrow-up"}
          ]
        }
      ]
    }
  },
  {
    "slug": "installation-climatisation",
    "nom": "Installation climatisation",
    "description": "Installation système climatisation réversible",
    "unite_prix": "unite",
    "prix_marche": {"min": 800, "max": 2500},
    "base_calcul": {"prix_moyen_unitaire": 1500, "temps_moyen_heures": 8},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Unité extérieure", "impact_prix": 400}, {"nom": "Liaisons frigorifiques", "impact_prix": 200}],
    "options": [{"nom": "Multi-split", "impact_prix": 800}],
    "dependances": ["electricite"],
    "questionnaire": {
      "surface_question": "Surface à climatiser (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_clim",
          "label": "Type de climatisation",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "mono_split", "label": "Mono-split", "icon": "circle"},
            {"value": "multi_split", "label": "Multi-split", "icon": "square"},
            {"value": "gainable", "label": "Gainable", "icon": "minus"}
          ]
        },
        {
          "id": "nb_unites",
          "label": "Nombre d'unités intérieures",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 8
        }
      ]
    }
  },
  {
    "slug": "pose-gouttiere",
    "nom": "Pose gouttière",
    "description": "Installation gouttières et descentes pluviales",
    "unite_prix": "ml",
    "prix_marche": {"min": 15, "max": 45},
    "base_calcul": {"prix_moyen_unitaire": 28, "temps_moyen_heures": 2},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Crochets de fixation", "impact_prix": 5}],
    "options": [{"nom": "Gouttière cuivre", "impact_prix": 25}],
    "dependances": ["couverture"],
    "questionnaire": {
      "surface_question": "Longueur de gouttière (mètres linéaires)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "materiau_gouttiere",
          "label": "Matériau de la gouttière",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "pvc", "label": "PVC", "icon": "circle"},
            {"value": "zinc", "label": "Zinc", "icon": "square"},
            {"value": "cuivre", "label": "Cuivre", "icon": "mountain"},
            {"value": "alu", "label": "Aluminium", "icon": "minus"}
          ]
        },
        {
          "id": "nb_descentes",
          "label": "Nombre de descentes",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 10
        }
      ]
    }
  },
  {
    "slug": "installation-spa",
    "nom": "Installation spa",
    "description": "Installation spa extérieur avec raccordements",
    "unite_prix": "forfait",
    "prix_marche": {"min": 8000, "max": 25000},
    "base_calcul": {"prix_moyen_unitaire": 15000, "temps_moyen_heures": 30},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Dalle béton", "impact_prix": 1500}, {"nom": "Raccordements", "impact_prix": 800}],
    "options": [{"nom": "Spa encastré", "impact_prix": 5000}],
    "dependances": ["electricite", "plomberie"],
    "questionnaire": {
      "surface_question": "Nombre de places du spa",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_spa",
          "label": "Type de spa",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "gonflable", "label": "Gonflable", "icon": "circle"},
            {"value": "rigide", "label": "Rigide", "icon": "square"},
            {"value": "encastre", "label": "Encastré", "icon": "minus"}
          ]
        },
        {
          "id": "nb_places",
          "label": "Nombre de places",
          "type": "number",
          "required": true,
          "min": 2,
          "max": 12
        }
      ]
    }
  },
  {
    "slug": "arrosage-automatique",
    "nom": "Arrosage automatique",
    "description": "Installation système d'arrosage automatique",
    "unite_prix": "m2",
    "prix_marche": {"min": 8, "max": 25},
    "base_calcul": {"prix_moyen_unitaire": 15, "temps_moyen_heures": 4},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Programmateur", "impact_prix": 200}, {"nom": "Électrovannes", "impact_prix": 150}],
    "options": [{"nom": "Sonde météo", "impact_prix": 300}],
    "dependances": ["plomberie", "electricite"],
    "questionnaire": {
      "surface_question": "Surface à arroser (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_arrosage",
          "label": "Type d'arrosage",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "aspersion", "label": "Aspersion", "icon": "circle"},
            {"value": "goutte_goutte", "label": "Goutte à goutte", "icon": "minus"},
            {"value": "micro_aspersion", "label": "Micro-aspersion", "icon": "square"}
          ]
        },
        {
          "id": "nb_zones",
          "label": "Nombre de zones",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 12
        }
      ]
    }
  },
  {
    "slug": "eclairage-exterieur",
    "nom": "Éclairage extérieur",
    "description": "Installation éclairage jardin et terrasse",
    "unite_prix": "forfait",
    "prix_marche": {"min": 500, "max": 2000},
    "base_calcul": {"prix_moyen_unitaire": 1000, "temps_moyen_heures": 12},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Câblage enterré", "impact_prix": 300}],
    "options": [{"nom": "Éclairage LED", "impact_prix": 400}],
    "dependances": ["electricite"],
    "questionnaire": {
      "surface_question": "Nombre de points lumineux",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_eclairage",
          "label": "Type d'éclairage",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "spots", "label": "Spots encastrés", "icon": "circle"},
            {"value": "bornes", "label": "Bornes", "icon": "square"},
            {"value": "appliques", "label": "Appliques", "icon": "minus"},
            {"value": "guirlandes", "label": "Guirlandes", "icon": "arrow-up"}
          ]
        },
        {
          "id": "nb_points",
          "label": "Nombre de points lumineux",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 20
        }
      ]
    }
  },
  {
    "slug": "pose-abri-jardin",
    "nom": "Pose abri jardin",
    "description": "Montage abri de jardin avec dalle béton",
    "unite_prix": "forfait",
    "prix_marche": {"min": 800, "max": 3000},
    "base_calcul": {"prix_moyen_unitaire": 1500, "temps_moyen_heures": 16},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Dalle béton", "impact_prix": 400}],
    "options": [{"nom": "Abri sur mesure", "impact_prix": 1000}],
    "dependances": ["terrassement"],
    "questionnaire": {
      "surface_question": "Surface de l'abri (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "materiau_abri",
          "label": "Matériau de l'abri",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "bois", "label": "Bois", "icon": "square"},
            {"value": "metal", "label": "Métal", "icon": "minus"},
            {"value": "pvc", "label": "PVC", "icon": "circle"}
          ]
        },
        {
          "id": "usage_abri",
          "label": "Usage de l'abri",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "stockage", "label": "Stockage", "icon": "square"},
            {"value": "atelier", "label": "Atelier", "icon": "mountain"},
            {"value": "garage", "label": "Garage vélo", "icon": "circle"}
          ]
        }
      ]
    }
  },
  {
    "slug": "peinture-exterieure",
    "nom": "Peinture extérieure",
    "description": "Peinture façade et boiseries extérieures",
    "unite_prix": "m2",
    "prix_marche": {"min": 25, "max": 60},
    "base_calcul": {"prix_moyen_unitaire": 40, "temps_moyen_heures": 6},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Préparation supports", "impact_prix": 12}, {"nom": "Sous-couche", "impact_prix": 8}],
    "options": [{"nom": "Peinture anti-mousse", "impact_prix": 15}],
    "dependances": ["echafaudage"],
    "questionnaire": {
      "surface_question": "Surface à peindre (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "support_peinture",
          "label": "Support à peindre",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "facade", "label": "Façade", "icon": "square"},
            {"value": "boiseries", "label": "Boiseries", "icon": "circle"},
            {"value": "volets", "label": "Volets", "icon": "minus"},
            {"value": "portail", "label": "Portail", "icon": "mountain"}
          ]
        },
        {
          "id": "etat_support",
          "label": "État du support",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "bon", "label": "Bon état", "icon": "circle"},
            {"value": "moyen", "label": "État moyen", "icon": "minus"},
            {"value": "mauvais", "label": "Mauvais état", "icon": "square"}
          ]
        }
      ]
    }
  },
  {
    "slug": "pose-sol-souple",
    "nom": "Pose sol souple",
    "description": "Installation revêtement souple PVC, lino, moquette",
    "unite_prix": "m2",
    "prix_marche": {"min": 15, "max": 45},
    "base_calcul": {"prix_moyen_unitaire": 28, "temps_moyen_heures": 4},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Ragréage", "impact_prix": 8}, {"nom": "Sous-couche", "impact_prix": 5}],
    "options": [{"nom": "Sol PVC clipsable", "impact_prix": 12}],
    "dependances": ["preparation_sol"],
    "questionnaire": {
      "surface_question": "Surface de sol (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_sol_souple",
          "label": "Type de revêtement",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "pvc", "label": "PVC", "icon": "circle"},
            {"value": "lino", "label": "Lino", "icon": "square"},
            {"value": "moquette", "label": "Moquette", "icon": "minus"},
            {"value": "vinyle", "label": "Vinyle", "icon": "arrow-up"}
          ]
        },
        {
          "id": "nb_pieces_sol",
          "label": "Nombre de pièces",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 15
        }
      ]
    }
  },
  {
    "slug": "pose-sol-dur",
    "nom": "Pose sol dur",
    "description": "Installation carrelage, pierre naturelle, béton ciré",
    "unite_prix": "m2",
    "prix_marche": {"min": 40, "max": 150},
    "base_calcul": {"prix_moyen_unitaire": 80, "temps_moyen_heures": 8},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Chape", "impact_prix": 20}, {"nom": "Primaire accrochage", "impact_prix": 12}],
    "options": [{"nom": "Pierre naturelle", "impact_prix": 60}],
    "dependances": ["preparation_sol"],
    "questionnaire": {
      "surface_question": "Surface de sol (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_sol_dur",
          "label": "Type de revêtement dur",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "carrelage", "label": "Carrelage", "icon": "square"},
            {"value": "pierre", "label": "Pierre naturelle", "icon": "mountain"},
            {"value": "beton_cire", "label": "Béton ciré", "icon": "circle"},
            {"value": "granit", "label": "Granit", "icon": "minus"}
          ]
        },
        {
          "id": "format_carrelage",
          "label": "Format (si carrelage)",
          "type": "cards",
          "required": false,
          "options": [
            {"value": "petit", "label": "Petit format", "icon": "circle"},
            {"value": "moyen", "label": "Format moyen", "icon": "square"},
            {"value": "grand", "label": "Grand format", "icon": "maximize"}
          ]
        }
      ]
    }
  },
  {
    "slug": "jointoyage",
    "nom": "Jointoyage",
    "description": "Réalisation joints placo, carrelage, maçonnerie",
    "unite_prix": "m2",
    "prix_marche": {"min": 8, "max": 25},
    "base_calcul": {"prix_moyen_unitaire": 15, "temps_moyen_heures": 3},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Ponçage", "impact_prix": 5}, {"nom": "Enduit lissage", "impact_prix": 8}],
    "options": [{"nom": "Joint époxy", "impact_prix": 8}],
    "dependances": ["cloisons"],
    "questionnaire": {
      "surface_question": "Surface de jointoyage (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_joint",
          "label": "Type de jointoyage",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "placo", "label": "Joints placo", "icon": "minus"},
            {"value": "carrelage", "label": "Joints carrelage", "icon": "square"},
            {"value": "maconnerie", "label": "Joints maçonnerie", "icon": "mountain"}
          ]
        },
        {
          "id": "finition_joint",
          "label": "Finition souhaitée",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "standard", "label": "Standard", "icon": "circle"},
            {"value": "lisse", "label": "Lisse", "icon": "minus"},
            {"value": "epoxy", "label": "Époxy", "icon": "arrow-up"}
          ]
        }
      ]
    }
  },
  {
    "slug": "isolation-murs-interieurs",
    "nom": "Isolation murs intérieurs",
    "description": "Isolation thermique et phonique murs intérieurs",
    "unite_prix": "m2",
    "prix_marche": {"min": 25, "max": 65},
    "base_calcul": {"prix_moyen_unitaire": 42, "temps_moyen_heures": 5},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Pare-vapeur", "impact_prix": 8}, {"nom": "Ossature métallique", "impact_prix": 15}],
    "options": [{"nom": "Isolation renforcée", "impact_prix": 18}],
    "dependances": ["cloisons"],
    "questionnaire": {
      "surface_question": "Surface de murs à isoler (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_isolation_int",
          "label": "Type d'isolation",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "thermique", "label": "Thermique", "icon": "circle"},
            {"value": "phonique", "label": "Phonique", "icon": "minus"},
            {"value": "mixte", "label": "Thermique + Phonique", "icon": "arrow-up"}
          ]
        },
        {
          "id": "materiau_isolant",
          "label": "Matériau isolant",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "laine_verre", "label": "Laine de verre", "icon": "circle"},
            {"value": "laine_roche", "label": "Laine de roche", "icon": "square"},
            {"value": "polystyrene", "label": "Polystyrène", "icon": "minus"}
          ]
        }
      ]
    }
  },
  {
    "slug": "isolation-murs-exterieurs",
    "nom": "Isolation murs extérieurs",
    "description": "ITE isolation thermique par l'extérieur",
    "unite_prix": "m2",
    "prix_marche": {"min": 80, "max": 180},
    "base_calcul": {"prix_moyen_unitaire": 120, "temps_moyen_heures": 8},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Enduit finition", "impact_prix": 25}, {"nom": "Fixations mécaniques", "impact_prix": 12}],
    "options": [{"nom": "Bardage bois", "impact_prix": 40}],
    "dependances": ["echafaudage"],
    "questionnaire": {
      "surface_question": "Surface de façade à isoler (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_ite",
          "label": "Type d'ITE",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "enduit", "label": "Sous enduit", "icon": "circle"},
            {"value": "bardage", "label": "Sous bardage", "icon": "square"},
            {"value": "vture", "label": "Sous vêture", "icon": "minus"}
          ]
        },
        {
          "id": "epaisseur_isolant",
          "label": "Épaisseur isolant (cm)",
          "type": "number",
          "required": true,
          "min": 8,
          "max": 20
        }
      ]
    }
  },
  {
    "slug": "extension-beton",
    "nom": "Extension béton",
    "description": "Extension maison structure béton banché",
    "unite_prix": "m2",
    "prix_marche": {"min": 1400, "max": 2800},
    "base_calcul": {"prix_moyen_unitaire": 2000, "temps_moyen_heures": 120},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Fondations", "impact_prix": 400}, {"nom": "Ferraillage", "impact_prix": 200}],
    "options": [{"nom": "Béton architectonique", "impact_prix": 300}],
    "dependances": ["terrassement", "maconnerie"],
    "questionnaire": {
      "surface_question": "Surface d'extension béton (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_beton",
          "label": "Type de construction béton",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "banche", "label": "Béton banché", "icon": "square"},
            {"value": "parpaing", "label": "Parpaing + béton", "icon": "circle"},
            {"value": "prefab", "label": "Préfabriqué", "icon": "minus"}
          ]
        },
        {
          "id": "nb_niveaux_beton",
          "label": "Nombre de niveaux",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 3
        }
      ]
    }
  },
  {
    "slug": "extension-bois",
    "nom": "Extension bois",
    "description": "Extension ossature bois avec isolation",
    "unite_prix": "m2",
    "prix_marche": {"min": 1200, "max": 2200},
    "base_calcul": {"prix_moyen_unitaire": 1600, "temps_moyen_heures": 80},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Ossature bois", "impact_prix": 300}, {"nom": "Isolation intégrée", "impact_prix": 150}],
    "options": [{"nom": "Bardage mélèze", "impact_prix": 200}],
    "dependances": ["charpente"],
    "questionnaire": {
      "surface_question": "Surface d'extension bois (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_ossature",
          "label": "Type d'ossature bois",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "traditionnelle", "label": "Traditionnelle", "icon": "square"},
            {"value": "prefab", "label": "Préfabriquée", "icon": "circle"},
            {"value": "poteaux_poutres", "label": "Poteaux-poutres", "icon": "mountain"}
          ]
        },
        {
          "id": "finition_ext",
          "label": "Finition extérieure",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "bardage", "label": "Bardage bois", "icon": "square"},
            {"value": "enduit", "label": "Enduit", "icon": "circle"},
            {"value": "mixte", "label": "Mixte", "icon": "arrow-up"}
          ]
        }
      ]
    }
  },
  {
    "slug": "surelevation",
    "nom": "Surélévation",
    "description": "Surélévation maison avec étage supplémentaire",
    "unite_prix": "m2",
    "prix_marche": {"min": 1600, "max": 3000},
    "base_calcul": {"prix_moyen_unitaire": 2200, "temps_moyen_heures": 150},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Renforcement structure", "impact_prix": 500}, {"nom": "Nouvelle charpente", "impact_prix": 400}],
    "options": [{"nom": "Toit terrasse", "impact_prix": 400}],
    "dependances": ["charpente", "maconnerie"],
    "questionnaire": {
      "surface_question": "Surface de surélévation (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_surelevation",
          "label": "Type de surélévation",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "ossature_bois", "label": "Ossature bois", "icon": "square"},
            {"value": "beton", "label": "Béton", "icon": "mountain"},
            {"value": "mixte", "label": "Mixte", "icon": "circle"}
          ]
        },
        {
          "id": "nb_niveaux",
          "label": "Nombre de niveaux à ajouter",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 3
        }
      ]
    }
  },
  {
    "slug": "pose-carrelage-mural",
    "nom": "Pose carrelage mural",
    "description": "Pose carrelage sur murs intérieurs et extérieurs",
    "unite_prix": "m2",
    "prix_marche": {"min": 30, "max": 80},
    "base_calcul": {"prix_moyen_unitaire": 50, "temps_moyen_heures": 6},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Préparation mur", "impact_prix": 12}, {"nom": "Colle carrelage", "impact_prix": 8}],
    "options": [{"nom": "Carrelage grand format", "impact_prix": 25}],
    "dependances": ["preparation_murs"],
    "questionnaire": {
      "surface_question": "Surface murale à carreler (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "zone_carrelage",
          "label": "Zone à carreler",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "salle_bain", "label": "Salle de bain", "icon": "circle"},
            {"value": "cuisine", "label": "Cuisine (crédence)", "icon": "square"},
            {"value": "wc", "label": "WC", "icon": "minus"},
            {"value": "exterieur", "label": "Extérieur", "icon": "mountain"}
          ]
        },
        {
          "id": "format_carrelage",
          "label": "Format de carrelage",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "standard", "label": "Standard (20x20)", "icon": "square"},
            {"value": "grand_format", "label": "Grand format (60x60)", "icon": "maximize"},
            {"value": "metro", "label": "Métro (7.5x15)", "icon": "minus"}
          ]
        }
      ]
    }
  },
  {
    "slug": "peinture-plafond",
    "nom": "Peinture plafond",
    "description": "Application peinture plafonds avec finition",
    "unite_prix": "m2",
    "prix_marche": {"min": 20, "max": 50},
    "base_calcul": {"prix_moyen_unitaire": 32, "temps_moyen_heures": 5},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Rebouchage fissures", "impact_prix": 8}, {"nom": "Sous-couche", "impact_prix": 6}],
    "options": [{"nom": "Peinture anti-condensation", "impact_prix": 12}],
    "dependances": ["preparation_plafond"],
    "questionnaire": {
      "surface_question": "Surface de plafond (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "etat_plafond",
          "label": "État actuel du plafond",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "bon", "label": "Bon état", "icon": "circle"},
            {"value": "fissures", "label": "Fissures légères", "icon": "minus"},
            {"value": "abime", "label": "Très abîmé", "icon": "square"}
          ]
        },
        {
          "id": "type_piece",
          "label": "Type de pièce",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "seche", "label": "Pièce sèche", "icon": "circle"},
            {"value": "humide", "label": "Pièce humide", "icon": "arrow-up"}
          ]
        }
      ]
    }
  },
  {
    "slug": "pose-cloison-placo",
    "nom": "Pose cloison placo",
    "description": "Installation cloisons plaques de plâtre",
    "unite_prix": "m2",
    "prix_marche": {"min": 25, "max": 55},
    "base_calcul": {"prix_moyen_unitaire": 38, "temps_moyen_heures": 4},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Rails métalliques", "impact_prix": 12}, {"nom": "Isolation phonique", "impact_prix": 15}],
    "options": [{"nom": "Placo hydrofuge", "impact_prix": 8}],
    "dependances": ["gros_oeuvre"],
    "questionnaire": {
      "surface_question": "Surface de cloison (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_cloison",
          "label": "Type de cloison",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "separative", "label": "Séparative", "icon": "minus"},
            {"value": "doublage", "label": "Doublage", "icon": "square"},
            {"value": "distributive", "label": "Distributive", "icon": "circle"}
          ]
        },
        {
          "id": "isolation_phonique",
          "label": "Isolation phonique",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "standard", "label": "Standard", "icon": "circle"},
            {"value": "renforcee", "label": "Renforcée", "icon": "arrow-up"}
          ]
        }
      ]
    }
  },
  {
    "slug": "pose-faience",
    "nom": "Pose faïence",
    "description": "Pose faïence murale salle de bain et cuisine",
    "unite_prix": "m2",
    "prix_marche": {"min": 35, "max": 85},
    "base_calcul": {"prix_moyen_unitaire": 55, "temps_moyen_heures": 7},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Étanchéité", "impact_prix": 15}, {"nom": "Baguettes finition", "impact_prix": 10}],
    "options": [{"nom": "Faïence mosaïque", "impact_prix": 20}],
    "dependances": ["preparation_murs"],
    "questionnaire": {
      "surface_question": "Surface de faïence (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "zone_faience",
          "label": "Zone à carreler",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "salle_bain", "label": "Salle de bain", "icon": "circle"},
            {"value": "cuisine", "label": "Cuisine", "icon": "square"},
            {"value": "wc", "label": "WC", "icon": "minus"}
          ]
        },
        {
          "id": "type_faience",
          "label": "Type de faïence",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "classique", "label": "Classique", "icon": "square"},
            {"value": "mosaique", "label": "Mosaïque", "icon": "circle"},
            {"value": "grand_format", "label": "Grand format", "icon": "maximize"}
          ]
        }
      ]
    }
  },
  {
    "slug": "chape-beton",
    "nom": "Chape béton",
    "description": "Réalisation chape béton de finition",
    "unite_prix": "m2",
    "prix_marche": {"min": 18, "max": 45},
    "base_calcul": {"prix_moyen_unitaire": 28, "temps_moyen_heures": 3},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Treillis soudé", "impact_prix": 8}, {"nom": "Joints de dilatation", "impact_prix": 5}],
    "options": [{"nom": "Chape fluide", "impact_prix": 12}],
    "dependances": ["gros_oeuvre"],
    "questionnaire": {
      "surface_question": "Surface de chape (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_chape",
          "label": "Type de chape",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "traditionnelle", "label": "Traditionnelle", "icon": "square"},
            {"value": "fluide", "label": "Fluide", "icon": "circle"},
            {"value": "seche", "label": "Sèche", "icon": "minus"}
          ]
        },
        {
          "id": "epaisseur",
          "label": "Épaisseur (cm)",
          "type": "number",
          "required": true,
          "min": 3,
          "max": 15
        }
      ]
    }
  },
  {
    "slug": "enduit-facade",
    "nom": "Enduit façade",
    "description": "Application enduit extérieur monocouche ou traditionnel",
    "unite_prix": "m2",
    "prix_marche": {"min": 35, "max": 80},
    "base_calcul": {"prix_moyen_unitaire": 55, "temps_moyen_heures": 6},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Gobetis", "impact_prix": 8}, {"nom": "Corps d'enduit", "impact_prix": 15}],
    "options": [{"nom": "Enduit gratté", "impact_prix": 12}],
    "dependances": ["echafaudage"],
    "questionnaire": {
      "surface_question": "Surface de façade (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_enduit",
          "label": "Type d'enduit souhaité",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "monocouche", "label": "Monocouche", "icon": "circle"},
            {"value": "traditionnel", "label": "Traditionnel 3 couches", "icon": "square"},
            {"value": "chaux", "label": "Enduit à la chaux", "icon": "mountain"}
          ]
        },
        {
          "id": "finition_enduit",
          "label": "Finition souhaitée",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "lisse", "label": "Lisse", "icon": "circle"},
            {"value": "gratte", "label": "Gratté", "icon": "minus"},
            {"value": "projete", "label": "Projeté", "icon": "square"}
          ]
        }
      ]
    }
  },
  {
    "slug": "pose-bardage",
    "nom": "Pose bardage",
    "description": "Installation bardage bois, composite ou métallique",
    "unite_prix": "m2",
    "prix_marche": {"min": 40, "max": 120},
    "base_calcul": {"prix_moyen_unitaire": 75, "temps_moyen_heures": 6},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Ossature support", "impact_prix": 20}, {"nom": "Pare-pluie", "impact_prix": 8}],
    "options": [{"nom": "Bardage composite", "impact_prix": 35}],
    "dependances": ["echafaudage"],
    "questionnaire": {
      "surface_question": "Surface de bardage (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "materiau_bardage",
          "label": "Matériau du bardage",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "bois", "label": "Bois naturel", "icon": "square"},
            {"value": "composite", "label": "Composite", "icon": "circle"},
            {"value": "pvc", "label": "PVC", "icon": "minus"},
            {"value": "metal", "label": "Métallique", "icon": "mountain"}
          ]
        },
        {
          "id": "pose_bardage",
          "label": "Type de pose",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "horizontal", "label": "Horizontal", "icon": "minus"},
            {"value": "vertical", "label": "Vertical", "icon": "arrow-up"},
            {"value": "claire_voie", "label": "Claire-voie", "icon": "square"}
          ]
        }
      ]
    }
  },
  {
    "slug": "terrassement",
    "nom": "Terrassement",
    "description": "Travaux de terrassement et nivellement terrain",
    "unite_prix": "m3",
    "prix_marche": {"min": 25, "max": 60},
    "base_calcul": {"prix_moyen_unitaire": 40, "temps_moyen_heures": 2},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Évacuation terre", "impact_prix": 15}, {"nom": "Compactage", "impact_prix": 8}],
    "options": [{"nom": "Géotextile", "impact_prix": 5}],
    "dependances": ["gros_oeuvre"],
    "questionnaire": {
      "surface_question": "Volume de terrassement (m³)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_terrassement",
          "label": "Type de terrassement",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "deblai", "label": "Déblai", "icon": "minus"},
            {"value": "remblai", "label": "Remblai", "icon": "arrow-up"},
            {"value": "nivellement", "label": "Nivellement", "icon": "circle"}
          ]
        },
        {
          "id": "acces_terrain",
          "label": "Accès au terrain",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "facile", "label": "Facile", "icon": "circle"},
            {"value": "difficile", "label": "Difficile", "icon": "square"}
          ]
        }
      ]
    }
  },
  {
    "slug": "dalle-beton",
    "nom": "Dalle béton",
    "description": "Coulage dalle béton armé avec finition",
    "unite_prix": "m2",
    "prix_marche": {"min": 35, "max": 80},
    "base_calcul": {"prix_moyen_unitaire": 55, "temps_moyen_heures": 4},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Ferraillage", "impact_prix": 15}, {"nom": "Coffrage", "impact_prix": 12}],
    "options": [{"nom": "Béton désactivé", "impact_prix": 20}],
    "dependances": ["terrassement"],
    "questionnaire": {
      "surface_question": "Surface de dalle (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "epaisseur_dalle",
          "label": "Épaisseur de dalle (cm)",
          "type": "number",
          "required": true,
          "min": 10,
          "max": 30
        },
        {
          "id": "usage_dalle",
          "label": "Usage de la dalle",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "terrasse", "label": "Terrasse", "icon": "circle"},
            {"value": "garage", "label": "Garage", "icon": "square"},
            {"value": "abri", "label": "Abri de jardin", "icon": "minus"},
            {"value": "allee", "label": "Allée", "icon": "arrow-up"}
          ]
        }
      ]
    }
  },
  {
    "slug": "etancheite-toiture",
    "nom": "Étanchéité toiture",
    "description": "Étanchéité toiture terrasse membrane EPDM ou bitume",
    "unite_prix": "m2",
    "prix_marche": {"min": 45, "max": 100},
    "base_calcul": {"prix_moyen_unitaire": 70, "temps_moyen_heures": 5},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Pare-vapeur", "impact_prix": 12}, {"nom": "Isolation", "impact_prix": 25}],
    "options": [{"nom": "Membrane EPDM", "impact_prix": 15}],
    "dependances": ["couverture"],
    "questionnaire": {
      "surface_question": "Surface de toiture (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_etancheite",
          "label": "Type d'étanchéité",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "epdm", "label": "Membrane EPDM", "icon": "circle"},
            {"value": "bitume", "label": "Bitume", "icon": "square"},
            {"value": "pvc", "label": "Membrane PVC", "icon": "minus"}
          ]
        },
        {
          "id": "type_toiture",
          "label": "Type de toiture",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "terrasse", "label": "Toit terrasse", "icon": "minus"},
            {"value": "faible_pente", "label": "Faible pente", "icon": "arrow-up"}
          ]
        }
      ]
    }
  },
  {
    "slug": "pose-moquette",
    "nom": "Pose moquette",
    "description": "Installation moquette avec thibaude et finitions",
    "unite_prix": "m2",
    "prix_marche": {"min": 20, "max": 60},
    "base_calcul": {"prix_moyen_unitaire": 35, "temps_moyen_heures": 3},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Thibaude", "impact_prix": 8}, {"nom": "Baguettes finition", "impact_prix": 5}],
    "options": [{"nom": "Moquette haut de gamme", "impact_prix": 25}],
    "dependances": ["preparation_sol"],
    "questionnaire": {
      "surface_question": "Surface de moquette (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_moquette",
          "label": "Type de moquette",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "bouclée", "label": "Bouclée", "icon": "circle"},
            {"value": "velours", "label": "Velours", "icon": "square"},
            {"value": "berber", "label": "Berbère", "icon": "mountain"}
          ]
        },
        {
          "id": "usage_moquette",
          "label": "Usage de la pièce",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "chambre", "label": "Chambre", "icon": "circle"},
            {"value": "salon", "label": "Salon", "icon": "square"},
            {"value": "bureau", "label": "Bureau", "icon": "minus"}
          ]
        }
      ]
    }
  },
  {
    "slug": "ragréage-sol",
    "nom": "Ragréage sol",
    "description": "Ragréage et préparation sol avant revêtement",
    "unite_prix": "m2",
    "prix_marche": {"min": 12, "max": 30},
    "base_calcul": {"prix_moyen_unitaire": 20, "temps_moyen_heures": 2},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Primaire d'accrochage", "impact_prix": 5}],
    "options": [{"nom": "Ragréage fibré", "impact_prix": 8}],
    "dependances": ["gros_oeuvre"],
    "questionnaire": {
      "surface_question": "Surface à ragréer (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "etat_sol_actuel",
          "label": "État du sol actuel",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "bon", "label": "Bon état", "icon": "circle"},
            {"value": "irregulier", "label": "Irrégulier", "icon": "minus"},
            {"value": "très_abimé", "label": "Très abîmé", "icon": "square"}
          ]
        },
        {
          "id": "epaisseur_ragréage",
          "label": "Épaisseur nécessaire (mm)",
          "type": "number",
          "required": true,
          "min": 2,
          "max": 30
        }
      ]
    }
  },
  {
    "slug": "installation-wc-suspendu",
    "nom": "Installation WC suspendu",
    "description": "Pose WC suspendu avec bâti-support et habillage",
    "unite_prix": "forfait",
    "prix_marche": {"min": 400, "max": 1200},
    "base_calcul": {"prix_moyen_unitaire": 700, "temps_moyen_heures": 6},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Bâti-support", "impact_prix": 200}, {"nom": "Habillage", "impact_prix": 150}],
    "options": [{"nom": "WC japonais", "impact_prix": 800}],
    "dependances": ["plomberie"],
    "questionnaire": {
      "surface_question": "Nombre de WC à installer",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_wc_suspendu",
          "label": "Type de WC suspendu",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "standard", "label": "Standard", "icon": "circle"},
            {"value": "compact", "label": "Compact", "icon": "minus"},
            {"value": "japonais", "label": "Japonais", "icon": "arrow-up"}
          ]
        },
        {
          "id": "type_habillage",
          "label": "Type d'habillage",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "placo", "label": "Placo", "icon": "square"},
            {"value": "carrelage", "label": "Carrelage", "icon": "circle"},
            {"value": "bois", "label": "Bois", "icon": "mountain"}
          ]
        }
      ]
    }
  },
  {
    "slug": "creation-allee",
    "nom": "Création allée",
    "description": "Création allée piétonne ou carrossable",
    "unite_prix": "m2",
    "prix_marche": {"min": 30, "max": 120},
    "base_calcul": {"prix_moyen_unitaire": 65, "temps_moyen_heures": 4},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Terrassement", "impact_prix": 15}, {"nom": "Fondation", "impact_prix": 20}],
    "options": [{"nom": "Éclairage intégré", "impact_prix": 40}],
    "dependances": ["terrassement"],
    "questionnaire": {
      "surface_question": "Surface d'allée (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_allee",
          "label": "Type d'allée",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "pietonne", "label": "Piétonne", "icon": "circle"},
            {"value": "carrossable", "label": "Carrossable", "icon": "square"}
          ]
        },
        {
          "id": "materiau_allee",
          "label": "Matériau souhaité",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "gravier", "label": "Gravier", "icon": "circle"},
            {"value": "pavés", "label": "Pavés", "icon": "square"},
            {"value": "béton", "label": "Béton", "icon": "minus"},
            {"value": "enrobé", "label": "Enrobé", "icon": "mountain"}
          ]
        }
      ]
    }
  },
  {
    "slug": "construction-pergola",
    "nom": "Construction pergola",
    "description": "Construction pergola bois, alu ou bioclimatique",
    "unite_prix": "m2",
    "prix_marche": {"min": 200, "max": 800},
    "base_calcul": {"prix_moyen_unitaire": 450, "temps_moyen_heures": 12},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Fondations", "impact_prix": 100}, {"nom": "Structure", "impact_prix": 200}],
    "options": [{"nom": "Pergola bioclimatique", "impact_prix": 400}],
    "dependances": ["terrassement"],
    "questionnaire": {
      "surface_question": "Surface de pergola (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "materiau_pergola",
          "label": "Matériau de la pergola",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "bois", "label": "Bois", "icon": "square"},
            {"value": "alu", "label": "Aluminium", "icon": "circle"},
            {"value": "bioclimatique", "label": "Bioclimatique", "icon": "arrow-up"}
          ]
        },
        {
          "id": "type_couverture",
          "label": "Type de couverture",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "ouverte", "label": "Ouverte", "icon": "circle"},
            {"value": "toile", "label": "Toile", "icon": "minus"},
            {"value": "polycarbonate", "label": "Polycarbonate", "icon": "square"},
            {"value": "lames_orientables", "label": "Lames orientables", "icon": "arrow-up"}
          ]
        }
      ]
    }
  },
  {
    "slug": "amenagement-paysager",
    "nom": "Aménagement paysager",
    "description": "Conception et réalisation jardin complet",
    "unite_prix": "m2",
    "prix_marche": {"min": 25, "max": 100},
    "base_calcul": {"prix_moyen_unitaire": 55, "temps_moyen_heures": 6},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Préparation terrain", "impact_prix": 15}, {"nom": "Plantation", "impact_prix": 25}],
    "options": [{"nom": "Éclairage paysager", "impact_prix": 40}],
    "dependances": ["terrassement"],
    "questionnaire": {
      "surface_question": "Surface à aménager (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "style_jardin",
          "label": "Style de jardin souhaité",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "moderne", "label": "Moderne", "icon": "square"},
            {"value": "japonais", "label": "Japonais", "icon": "circle"},
            {"value": "mediterraneen", "label": "Méditerranéen", "icon": "mountain"},
            {"value": "anglais", "label": "Anglais", "icon": "arrow-up"}
          ]
        },
        {
          "id": "elements_souhaites",
          "label": "Éléments souhaités",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "pelouse", "label": "Pelouse", "icon": "circle"},
            {"value": "massifs", "label": "Massifs", "icon": "square"},
            {"value": "arbres", "label": "Arbres", "icon": "mountain"},
            {"value": "bassin", "label": "Bassin", "icon": "minus"}
          ]
        }
      ]
    }
  },
  {
    "slug": "installation-domotique",
    "nom": "Installation domotique",
    "description": "Système domotique connecté et automatisation",
    "unite_prix": "forfait",
    "prix_marche": {"min": 800, "max": 5000},
    "base_calcul": {"prix_moyen_unitaire": 2500, "temps_moyen_heures": 16},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Box domotique", "impact_prix": 300}, {"nom": "Capteurs", "impact_prix": 200}],
    "options": [{"nom": "Système vocal", "impact_prix": 500}],
    "dependances": ["electricite"],
    "questionnaire": {
      "surface_question": "Nombre de pièces à équiper",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "fonctions_domotique",
          "label": "Fonctions souhaitées",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "eclairage", "label": "Éclairage", "icon": "circle"},
            {"value": "chauffage", "label": "Chauffage", "icon": "arrow-up"},
            {"value": "volets", "label": "Volets", "icon": "minus"},
            {"value": "securite", "label": "Sécurité", "icon": "square"}
          ]
        },
        {
          "id": "niveau_automatisation",
          "label": "Niveau d'automatisation",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "basique", "label": "Basique", "icon": "circle"},
            {"value": "avance", "label": "Avancé", "icon": "arrow-up"},
            {"value": "complet", "label": "Complet", "icon": "maximize"}
          ]
        }
      ]
    }
  },
  {
    "slug": "pose-store-banne",
    "nom": "Pose store banne",
    "description": "Installation store banne motorisé avec coffre",
    "unite_prix": "forfait",
    "prix_marche": {"min": 600, "max": 2500},
    "base_calcul": {"prix_moyen_unitaire": 1200, "temps_moyen_heures": 4},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Support mural", "impact_prix": 150}, {"nom": "Motorisation", "impact_prix": 300}],
    "options": [{"nom": "Capteur vent/soleil", "impact_prix": 200}],
    "dependances": ["electricite"],
    "questionnaire": {
      "surface_question": "Largeur du store (m)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_store",
          "label": "Type de store",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "coffre", "label": "Avec coffre", "icon": "square"},
            {"value": "semi_coffre", "label": "Semi-coffre", "icon": "minus"},
            {"value": "monobloc", "label": "Monobloc", "icon": "circle"}
          ]
        },
        {
          "id": "avancee_store",
          "label": "Avancée souhaitée (m)",
          "type": "number",
          "required": true,
          "min": 2,
          "max": 6
        }
      ]
    }
  },
  {
    "slug": "engazonnement",
    "nom": "Engazonnement",
    "description": "Création pelouse par semis ou gazon en rouleau",
    "unite_prix": "m2",
    "prix_marche": {"min": 8, "max": 25},
    "base_calcul": {"prix_moyen_unitaire": 15, "temps_moyen_heures": 2},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Préparation terrain", "impact_prix": 5}, {"nom": "Amendement", "impact_prix": 3}],
    "options": [{"nom": "Gazon de placage", "impact_prix": 12}],
    "dependances": ["terrassement"],
    "questionnaire": {
      "surface_question": "Surface de pelouse (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_gazon",
          "label": "Type de gazon",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "semis", "label": "Semis", "icon": "circle"},
            {"value": "rouleau", "label": "Gazon en rouleau", "icon": "square"},
            {"value": "placage", "label": "Gazon de placage", "icon": "arrow-up"}
          ]
        },
        {
          "id": "usage_pelouse",
          "label": "Usage de la pelouse",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "decoratif", "label": "Décoratif", "icon": "circle"},
            {"value": "detente", "label": "Détente", "icon": "minus"},
            {"value": "sport", "label": "Sport/jeux", "icon": "square"}
          ]
        }
      ]
    }
  },
  {
    "slug": "petits-travaux-plomberie",
    "nom": "Petits travaux de plomberie",
    "description": "Réparations et petits travaux de plomberie",
    "unite_prix": "forfait",
    "prix_marche": {"min": 80, "max": 300},
    "base_calcul": {"prix_moyen_unitaire": 150, "temps_moyen_heures": 2},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Déplacement", "impact_prix": 30}],
    "options": [{"nom": "Urgence", "impact_prix": 50}],
    "dependances": ["plomberie"],
    "questionnaire": {
      "surface_question": "Nombre d'interventions",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_intervention",
          "label": "Type d'intervention",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "fuite", "label": "Réparation fuite", "icon": "circle"},
            {"value": "robinet", "label": "Robinetterie", "icon": "minus"},
            {"value": "wc", "label": "WC", "icon": "square"},
            {"value": "evacuation", "label": "Évacuation", "icon": "arrow-up"}
          ]
        },
        {
          "id": "urgence",
          "label": "Urgence",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "normale", "label": "Normale", "icon": "circle"},
            {"value": "urgente", "label": "Urgente", "icon": "arrow-up"}
          ]
        }
      ]
    }
  },
  {
    "slug": "petits-travaux-electricite",
    "nom": "Petits travaux d'électricité",
    "description": "Réparations et petits travaux électriques",
    "unite_prix": "forfait",
    "prix_marche": {"min": 60, "max": 250},
    "base_calcul": {"prix_moyen_unitaire": 120, "temps_moyen_heures": 1.5},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Déplacement", "impact_prix": 25}],
    "options": [{"nom": "Mise aux normes", "impact_prix": 80}],
    "dependances": ["electricite"],
    "questionnaire": {
      "surface_question": "Nombre de points à traiter",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_travaux_elec",
          "label": "Type de travaux",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "prise", "label": "Prises électriques", "icon": "square"},
            {"value": "interrupteur", "label": "Interrupteurs", "icon": "circle"},
            {"value": "luminaire", "label": "Luminaires", "icon": "arrow-up"},
            {"value": "tableau", "label": "Tableau électrique", "icon": "mountain"}
          ]
        },
        {
          "id": "nb_points_elec",
          "label": "Nombre de points",
          "type": "number",
          "required": true,
          "min": 1,
          "max": 20
        }
      ]
    }
  },
  {
    "slug": "elagage",
    "nom": "Élagage",
    "description": "Élagage et taille d'arbres",
    "unite_prix": "forfait",
    "prix_marche": {"min": 150, "max": 800},
    "base_calcul": {"prix_moyen_unitaire": 400, "temps_moyen_heures": 4},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Évacuation déchets", "impact_prix": 100}],
    "options": [{"nom": "Dessouchage", "impact_prix": 200}],
    "dependances": ["jardinage"],
    "questionnaire": {
      "surface_question": "Nombre d'arbres",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "taille_arbre",
          "label": "Taille des arbres",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "petit", "label": "Petit (< 5m)", "icon": "circle"},
            {"value": "moyen", "label": "Moyen (5-10m)", "icon": "square"},
            {"value": "grand", "label": "Grand (> 10m)", "icon": "mountain"}
          ]
        },
        {
          "id": "type_elagage",
          "label": "Type d'élagage",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "entretien", "label": "Entretien", "icon": "circle"},
            {"value": "securite", "label": "Sécurité", "icon": "square"},
            {"value": "abattage", "label": "Abattage", "icon": "minus"}
          ]
        }
      ]
    }
  },
  {
    "slug": "entretien-jardin",
    "nom": "Entretien de jardin et d'espaces verts",
    "description": "Entretien complet jardin et espaces verts",
    "unite_prix": "m2",
    "prix_marche": {"min": 5, "max": 25},
    "base_calcul": {"prix_moyen_unitaire": 12, "temps_moyen_heures": 1},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Tonte pelouse", "impact_prix": 3}, {"nom": "Taille haies", "impact_prix": 5}],
    "options": [{"nom": "Traitement phytosanitaire", "impact_prix": 8}],
    "dependances": ["jardinage"],
    "questionnaire": {
      "surface_question": "Surface du jardin (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "frequence_entretien",
          "label": "Fréquence d'entretien",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "ponctuel", "label": "Ponctuel", "icon": "circle"},
            {"value": "mensuel", "label": "Mensuel", "icon": "square"},
            {"value": "hebdomadaire", "label": "Hebdomadaire", "icon": "arrow-up"}
          ]
        },
        {
          "id": "services_jardin",
          "label": "Services souhaités",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "tonte", "label": "Tonte", "icon": "circle"},
            {"value": "taille", "label": "Taille haies", "icon": "square"},
            {"value": "plantation", "label": "Plantation", "icon": "mountain"},
            {"value": "complet", "label": "Entretien complet", "icon": "maximize"}
          ]
        }
      ]
    }
  },
  {
    "slug": "nettoyage-locaux",
    "nom": "Ménage - Nettoyage de locaux",
    "description": "Nettoyage professionnel de locaux",
    "unite_prix": "m2",
    "prix_marche": {"min": 8, "max": 25},
    "base_calcul": {"prix_moyen_unitaire": 15, "temps_moyen_heures": 1},
    "multiplicateurs_gamme": {"economique": 0.85, "standard": 1, "premium": 1.4},
    "multiplicateurs_etat": {"neuf": 0.9, "renovation": 1, "renovation_lourde": 1.3},
    "sous_prestations": [{"nom": "Produits inclus", "impact_prix": 3}],
    "options": [{"nom": "Nettoyage vitres", "impact_prix": 5}],
    "dependances": ["nettoyage"],
    "questionnaire": {
      "surface_question": "Surface à nettoyer (m²)",
      "surface_required": true,
      "questions_specifiques": [
        {
          "id": "type_local",
          "label": "Type de local",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "bureau", "label": "Bureau", "icon": "square"},
            {"value": "commerce", "label": "Commerce", "icon": "circle"},
            {"value": "entrepot", "label": "Entrepôt", "icon": "mountain"},
            {"value": "particulier", "label": "Particulier", "icon": "minus"}
          ]
        },
        {
          "id": "frequence_nettoyage",
          "label": "Fréquence",
          "type": "cards",
          "required": true,
          "options": [
            {"value": "ponctuel", "label": "Ponctuel", "icon": "circle"},
            {"value": "hebdomadaire", "label": "Hebdomadaire", "icon": "square"},
            {"value": "quotidien", "label": "Quotidien", "icon": "arrow-up"}
          ]
        }
      ]
    }
  }
];

// Générer automatiquement les suggestions à partir des prestations qui ont des questionnaires
export const renovationSuggestions = renovationPrestations
  .filter(prestation => prestation.questionnaire) // Seulement celles avec questionnaire
  .map(prestation => prestation.nom);

// Suggestions les plus recherchées (affichées par défaut)
export const popularSuggestions = renovationSuggestions.slice(0, 8);

// Fonction pour supprimer les accents
const removeAccents = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Fonction pour calculer la distance de Levenshtein (tolérance aux fautes)
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

// Synonymes et mots-clés alternatifs
const synonyms: { [key: string]: string[] } = {
  "wc": ["toilettes", "sanitaires", "cabinet"],
  "sdb": ["salle de bain", "salle d'eau"],
  "elec": ["électricité", "électrique"],
  "plomb": ["plomberie", "plombier"],
  "carrel": ["carrelage", "faïence"],
  "parqu": ["parquet", "sol bois"],
  "peintu": ["peinture", "peindre"],
  "isol": ["isolation", "isoler"],
  "chauf": ["chauffage", "radiateur"],
  "cuisin": ["cuisine", "kitchenette"],
  "jardin": ["espaces verts", "paysager"],
  "toitu": ["toiture", "couverture", "toit"],
  "fenêt": ["fenêtre", "menuiserie"],
  "clim": ["climatisation", "clim"],
  "terras": ["terrasse", "balcon"]
};

// Fonction de recherche tolérante améliorée
export const getFilteredSuggestions = (input: string, maxResults: number = 8): string[] => {
  if (!input || input.length < 2) return [];
  
  const normalizedInput = removeAccents(input.toLowerCase().trim());
  const inputWords = normalizedInput.split(/\s+/);
  
  // Fonction pour calculer le score de pertinence
  const calculateRelevanceScore = (suggestion: string): number => {
    const normalizedSuggestion = removeAccents(suggestion.toLowerCase());
    let score = 0;
    
    // 1. Correspondance exacte (score max)
    if (normalizedSuggestion.includes(normalizedInput)) {
      score += 100;
    }
    
    // 2. Correspondance de mots individuels
    inputWords.forEach(word => {
      if (word.length >= 2) {
        if (normalizedSuggestion.includes(word)) {
          score += 50;
        } else {
          // 3. Tolérance aux fautes de frappe (distance de Levenshtein)
          const suggestionWords = normalizedSuggestion.split(/\s+/);
          suggestionWords.forEach(suggWord => {
            if (suggWord.length >= 3) {
              const distance = levenshteinDistance(word, suggWord);
              const maxLength = Math.max(word.length, suggWord.length);
              if (distance <= Math.floor(maxLength * 0.3)) { // 30% de tolérance
                score += 30 - (distance * 5);
              }
            }
          });
        }
      }
    });
    
    // 4. Correspondance avec synonymes
    Object.entries(synonyms).forEach(([key, values]) => {
      if (normalizedInput.includes(key)) {
        values.forEach(synonym => {
          if (normalizedSuggestion.includes(synonym)) {
            score += 40;
          }
        });
      }
    });
    
    // 5. Correspondance partielle au début des mots (préfixes)
    inputWords.forEach(word => {
      if (word.length >= 3) {
        const suggestionWords = normalizedSuggestion.split(/\s+/);
        suggestionWords.forEach(suggWord => {
          if (suggWord.startsWith(word) || word.startsWith(suggWord.substring(0, 3))) {
            score += 25;
          }
        });
      }
    });
    
    return score;
  };
  
  // Filtrer et trier par pertinence
  const scoredSuggestions = renovationSuggestions
    .map(suggestion => ({
      suggestion,
      score: calculateRelevanceScore(suggestion)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(item => item.suggestion);
  
  return scoredSuggestions;
};

export const getPopularSuggestions = (maxResults: number = 8): string[] => {
  return popularSuggestions.slice(0, maxResults);
};
