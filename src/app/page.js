// src/app/page.js

export default function Home() {
  return (
    // Remove the <main> tag and its classes from here
    // Let the layout.js <main> tag handle the main container structure
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to the Blog Platform!</h1>
      <p className="text-lg text-gray-700 text-center mb-4">
        This is the homepage. You can navigate using the links above.
      </p>
      <p className="text-center text-gray-500">
        (Content for the blog listing will eventually go on the '/blog' page).
      </p>
      {/*
          The original content from create-next-app (like the Next.js logo,
          Vercel links etc.) has been removed to avoid layout conflicts.
          You can add your desired homepage content here.
       */}
    </div>
  );
}