import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogArticleComplete from "@/components/blog/BlogArticleComplete";
import RelatedArticles from "@/components/blog/RelatedArticles";
import blogData from "@/data/blog-articles.json";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Fonction pour récupérer l'article par slug
function getArticleBySlug(slug: string) {
  return blogData.articles.find(article => article.slug === slug);
}

// Génération des métadonnées dynamiques
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: "Article non trouvé",
    };
  }

  return {
    title: article.seo.metaTitle,
    description: article.seo.metaDescription,
    keywords: article.seo.keywords.join(", "),
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.seo.metaTitle,
      description: article.seo.metaDescription,
      url: article.seo.canonicalUrl,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      images: [
        {
          url: article.featuredImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.seo.metaTitle,
      description: article.seo.metaDescription,
      images: [article.featuredImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: article.seo.canonicalUrl,
    },
  };
}

// Génération des pages statiques
export async function generateStaticParams() {
  return blogData.articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Récupérer les articles liés
  const relatedArticles = blogData.articles.filter(a => 
    article.relatedArticles.includes(a.id) || 
    (a.category === article.category && a.id !== article.id)
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <BlogArticleComplete article={article} />
        <RelatedArticles articles={relatedArticles} />
      </main>
      
      <Footer />
    </div>
  );
}
