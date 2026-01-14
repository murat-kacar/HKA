
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import JsonLd from '@/app/components/JsonLd';
import prisma from '@/app/lib/prisma';

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Fetch Global Settings for Schema (optional - won't crash if table doesn't exist)
    let settings = null;
    try {
        settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    } catch (err) {
        console.log('SiteSettings table not found, using defaults', err);
    }
    const social = settings?.socialLinks as any || {};

    // Prepare Organization Schema
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "PerformingGroup", // More specific than Organization for theater/academy
        "name": "Hakan Karsak Akademi",
        "url": process.env.NEXT_PUBLIC_APP_URL || "https://hakankarsakakademi.com",
        "logo": "https://hakankarsakakademi.com/logo.png", // Replace with actual logo URL if available
        "description": settings?.seoDescription || "Oyunculuk ve Sahne Sanatları Akademisi",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": settings?.contactInfo || "Adres bilgisi"
        },
        "sameAs": [
            social.instagram,
            social.twitter,
            social.linkedin,
            social.facebook,
            social.youtube
        ].filter(Boolean) // Remove empty links
    };

    return (
        <div className="flex flex-col min-h-screen">
            <JsonLd data={organizationSchema} />
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
