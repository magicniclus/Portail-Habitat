# Index Firebase Firestore requis

## Index pour la collection `leads` (sous-collection de `artisans`)

### Erreur rencontrée :
```
FirebaseError: The query requires an index. You can create it here: 
https://console.firebase.google.com/v1/r/project/portail-habitat-2ac32/firestore/indexes?create_composite=ClNwcm9qZWN0cy9wb3J0YWlsLWhhYml0YXQtMmFjMzIvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2xlYWRzL2luZGV4ZXMvXxABGgoKBnNvdXJjZRABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI
```

### ⚠️ ACTION IMMÉDIATE REQUISE :
**L'index a été automatiquement ouvert dans votre navigateur !**

### Index requis :
**Collection :** `leads` (sous-collection de `artisans/{artisanId}/leads`)

**Champs :**
1. `source` (Ascending)
2. `createdAt` (Descending) 
3. `__name__` (Descending)

### Utilisation :
Cet index est utilisé pour la requête dans `getBoughtLeads()` :
```typescript
const q = query(
  leadsRef, 
  where("source", "==", "bought"),
  orderBy("createdAt", "desc")
);
```

### Création de l'index :

#### Option 1 : Via la console Firebase
1. Aller sur : https://console.firebase.google.com/project/portail-habitat-2ac32/firestore/indexes
2. Cliquer sur "Create Index"
3. Collection : `leads`
4. Ajouter les champs :
   - `source` : Ascending
   - `createdAt` : Descending

#### Option 2 : Via le lien direct (OUVERT AUTOMATIQUEMENT)
✅ **Le lien a été automatiquement ouvert dans votre navigateur !**
URL : https://console.firebase.google.com/v1/r/project/portail-habitat-2ac32/firestore/indexes?create_composite=ClNwcm9qZWN0cy9wb3J0YWlsLWhhYml0YXQtMmFjMzIvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2xlYWRzL2luZGV4ZXMvXxABGgoKBnNvdXJjZRABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI

**Instructions :**
1. La page Firebase s'est ouverte avec l'index pré-configuré
2. Cliquez simplement sur "Create Index" 
3. Attendez quelques minutes que l'index soit créé
4. L'erreur disparaîtra automatiquement

#### Option 3 : Via firestore.indexes.json
```json
{
  "indexes": [
    {
      "collectionGroup": "leads",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "source",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
  ]
}
```

### Notes :
- L'index sera créé pour la collection group `leads` 
- Cela permettra de filtrer par `source = "bought"` et trier par `createdAt desc`
- L'index prend quelques minutes à être créé par Firebase
- Une fois créé, la requête fonctionnera sans erreur
