// src/pages/public/NotFound.tsx
export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-serif mb-4">404</h1>
        <p className="text-gray-600 mb-8">Page not found</p>
        <a href="/" className="bg-gold text-green-deep px-8 py-3 rounded-full">
          Back Home
        </a>
      </div>
    </div>
  );
}

