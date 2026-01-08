
import React from 'react';

type JsonLdProps = {
    data: Record<string, any> | Record<string, any>[];
};

/**
 * Renders a JSON-LD script tag for Schema.org structured data.
 * Usage: <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", ... }} />
 */
export default function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
