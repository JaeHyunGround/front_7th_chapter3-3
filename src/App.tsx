import { BrowserRouter as Router } from "react-router-dom"
import { Header, Footer } from "@/app/ui"
import PostsManagerPage from "./pages/PostsManagerPage.tsx"
import { QueryProvider } from "@/app/providers"

const App = () => {
  return (
    <QueryProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <PostsManagerPage />
          </main>
          <Footer />
        </div>
      </Router>
    </QueryProvider>
  )
}

export default App
