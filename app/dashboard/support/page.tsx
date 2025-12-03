import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  HelpCircle, 
  Mail, 
  ChevronDown,
  ChevronRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Support - Dashboard Pro - Portail Habitat",
  description: "Contactez notre équipe support et accédez à l'aide.",
  robots: {
    index: false,
    follow: false,
  },
};

const faqCategories = [
  {
    title: "Gestion du profil",
    items: [
      {
        question: "Comment modifier mon profil artisan ?",
        answer: "Rendez-vous dans la section 'Mon site' du dashboard. Cliquez sur 'Modifier' en haut à droite pour accéder à l'édition de votre profil. Vous pouvez y modifier vos informations personnelles, vos services, votre zone d'intervention et ajouter des photos de vos réalisations."
      },
      {
        question: "Comment ajouter des photos de mes réalisations ?",
        answer: "Dans la section 'Mon site', cliquez sur 'Ajouter des photos'. Vous pouvez télécharger jusqu'à 20 photos de vos travaux. Assurez-vous que les images sont de bonne qualité (minimum 800x600 pixels) et au format JPG ou PNG."
      },
      {
        question: "Comment modifier ma zone d'intervention ?",
        answer: "Dans votre profil, section 'Zone d'intervention', vous pouvez ajouter ou supprimer des villes et départements. Cela permet aux clients de votre secteur de vous trouver plus facilement."
      },
      {
        question: "Pourquoi mon profil n'apparaît-il pas dans les résultats de recherche ?",
        answer: "Vérifiez que votre profil est complet (minimum 70% de complétude), que votre compte est vérifié, et que vous avez bien défini votre zone d'intervention. Un profil incomplet ou non vérifié n'apparaît pas dans les recherches."
      }
    ]
  },
  {
    title: "Demandes et leads",
    items: [
      {
        question: "Comment recevoir plus de demandes ?",
        answer: "Pour augmenter vos demandes : complétez votre profil à 100%, ajoutez des photos de qualité, obtenez des avis clients positifs, répondez rapidement aux demandes, et maintenez un taux de réponse élevé. Un profil bien optimisé reçoit 3x plus de demandes."
      },
      {
        question: "Pourquoi je ne reçois pas de demandes ?",
        answer: "Plusieurs raisons possibles : profil incomplet, zone d'intervention trop restreinte, pas d'avis clients, ou forte concurrence dans votre secteur. Vérifiez votre profil et élargissez votre zone d'intervention si nécessaire."
      },
      {
        question: "Comment répondre à une demande de devis ?",
        answer: "Allez dans 'Mes demandes', cliquez sur la demande qui vous intéresse, puis sur 'Répondre'. Vous pouvez contacter le client par téléphone, email ou via notre messagerie intégrée. Répondez dans les 24h pour maximiser vos chances."
      },
      {
        question: "Que faire si un client ne répond pas ?",
        answer: "Relancez le client après 48h par un autre moyen de contact. Si pas de réponse après 1 semaine, vous pouvez marquer la demande comme 'fermée'. Certains clients comparent plusieurs devis avant de décider."
      }
    ]
  },
  {
    title: "Compte et paramètres",
    items: [
      {
        question: "Comment changer mon mot de passe ?",
        answer: "Cliquez sur votre nom en bas de la sidebar, puis 'Paramètres'. Dans l'onglet 'Sécurité', vous pouvez modifier votre mot de passe. Utilisez un mot de passe fort avec au moins 8 caractères."
      },
      {
        question: "Comment supprimer mon compte ?",
        answer: "Pour supprimer votre compte, contactez-nous par email à support@portail-habitat.fr. La suppression est définitive et entraîne la perte de toutes vos données et demandes en cours."
      },
      {
        question: "Comment modifier mes notifications ?",
        answer: "Dans 'Paramètres' > 'Notifications', vous pouvez choisir de recevoir les alertes par email, SMS ou dans l'application. Nous recommandons de garder les notifications de nouvelles demandes activées."
      },
      {
        question: "Mon compte est-il sécurisé ?",
        answer: "Oui, nous utilisons un chiffrement SSL, l'authentification à deux facteurs optionnelle, et nos serveurs sont hébergés en France. Vos données sont protégées selon le RGPD."
      }
    ]
  },
  {
    title: "Problèmes techniques",
    items: [
      {
        question: "Je n'arrive pas à me connecter",
        answer: "Vérifiez votre email et mot de passe. Si vous avez oublié votre mot de passe, utilisez 'Mot de passe oublié'. Videz le cache de votre navigateur si le problème persiste. Contactez-nous si ça ne fonctionne toujours pas."
      },
      {
        question: "Le site est lent ou ne fonctionne pas",
        answer: "Vérifiez votre connexion internet. Essayez de rafraîchir la page (Ctrl+F5). Si le problème persiste, il peut s'agir d'une maintenance temporaire. Consultez notre page statut ou contactez-nous."
      },
      {
        question: "Je ne reçois pas les emails de notification",
        answer: "Vérifiez votre dossier spam/courrier indésirable. Ajoutez @portail-habitat.fr à votre liste de contacts autorisés. Vérifiez que votre adresse email est correcte dans vos paramètres."
      },
      {
        question: "L'application mobile ne fonctionne pas",
        answer: "Mettez à jour l'application vers la dernière version. Redémarrez votre téléphone. Vérifiez que vous avez une connexion internet stable. Contactez-nous si le problème persiste."
      }
    ]
  },
  {
    title: "Facturation et abonnement",
    items: [
      {
        question: "Comment fonctionne la facturation ?",
        answer: "Vous payez uniquement pour les demandes de devis que vous recevez dans votre secteur d'activité. Pas d'abonnement mensuel, pas de frais cachés. Le prix varie selon le type de travaux et votre localisation."
      },
      {
        question: "Puis-je avoir une facture ?",
        answer: "Oui, toutes vos factures sont disponibles dans votre espace client. Vous recevez également une facture par email chaque mois. Les factures sont conformes à la législation française."
      },
      {
        question: "Comment modifier mes informations de facturation ?",
        answer: "Dans 'Paramètres' > 'Facturation', vous pouvez modifier votre adresse de facturation, votre numéro de SIRET, et vos coordonnées bancaires pour les remboursements éventuels."
      },
      {
        question: "Que se passe-t-il si je ne paye pas ?",
        answer: "Après 30 jours d'impayé, votre compte est suspendu et vous ne recevez plus de demandes. Après 60 jours, le compte peut être fermé définitivement. Contactez-nous en cas de difficultés de paiement."
      }
    ]
  }
];

export default function SupportPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact & Support</h1>
          <p className="text-muted-foreground">
            Trouvez des réponses à vos questions ou contactez-nous par email
          </p>
        </div>
      </div>

      {/* Contact Email */}
      <Card>
        <CardHeader className="text-center">
          <Mail className="h-12 w-12 mx-auto text-primary mb-4" />
          <CardTitle className="text-2xl">Contactez-nous par email</CardTitle>
          <CardDescription>
            Notre équipe support vous répond sous 24h
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="font-semibold text-lg">support@portail-habitat.fr</p>
            <p className="text-sm text-muted-foreground mt-2">
              Disponible du lundi au vendredi, 9h-18h
            </p>
          </div>
          <Button className="w-full max-w-md mx-auto" size="lg">
            <Mail className="h-4 w-4 mr-2" />
            Envoyer un email
          </Button>
        </CardContent>
      </Card>

      {/* FAQ Complète */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Foire aux questions</h2>
          <p className="text-muted-foreground">
            Trouvez rapidement des réponses à vos questions les plus fréquentes
          </p>
        </div>

        {faqCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span>{category.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="border rounded-lg">
                    <details className="group">
                      <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <span className="font-medium text-sm">{item.question}</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="px-4 pb-4 text-sm text-muted-foreground border-t">
                        <div className="pt-4">
                          {item.answer}
                        </div>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact final */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="text-center p-6">
          <h3 className="font-semibold mb-2">Vous ne trouvez pas la réponse à votre question ?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Notre équipe support est là pour vous aider
          </p>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Contactez le support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
