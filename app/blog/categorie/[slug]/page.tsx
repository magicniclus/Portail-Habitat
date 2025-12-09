import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCategoryPage from "@/components/blog/BlogCategoryPage";
import blogData from "@/data/blog-articles.json";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// Fonction pour récupérer la catégorie par slug
function getCategoryBySlug(slug: string) {
  return blogData.categories.find(category => category.slug === slug);
}

// Génération des métadonnées dynamiques
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  
  if (!category) {
    return {
      title: "Catégorie non trouvée",
    };
  }

  const articlesCount = blogData.articles.filter(article => article.category === category.id).length;

  return {
    title: `${category.name} - Blog Portail Habitat`,
    description: `${category.description}. Découvrez nos ${articlesCount} articles sur ${category.name.toLowerCase()}.`,
    keywords: `${category.name.toLowerCase()}, blog rénovation, conseils travaux, guides ${category.name.toLowerCase()}`,
    openGraph: {
      title: `${category.name} - Blog Portail Habitat`,
      description: category.description,
      url: `https://portail-habitat.fr/blog/categorie/${category.slug}`,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://portail-habitat.fr/blog/categorie/${category.slug}`,
    },
  };
}

// Génération des pages statiques
export async function generateStaticParams() {
  return blogData.categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Filtrer les articles de cette catégorie
  const categoryArticles = blogData.articles.filter(article => article.category === category.id);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <BlogCategoryPage category={category} articles={categoryArticles} />
      </main>
      
      <Footer />
    </div>
  );
}
