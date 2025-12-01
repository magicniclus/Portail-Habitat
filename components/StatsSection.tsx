export default function StatsSection() {
  const stats = [
    { value: "2,500+", label: "Professionnels inscrits", color: "text-blue-600" },
    { value: "15,000+", label: "Leads générés", color: "text-green-600" },
    { value: "95%", label: "Taux de satisfaction", color: "text-yellow-600" },
    { value: "24h", label: "Temps de réponse moyen", color: "text-purple-600" },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Nos professionnels nous font confiance
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-4xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-gray-600 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
