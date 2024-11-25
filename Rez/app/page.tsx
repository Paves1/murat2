import { Home } from '../components/Home'
import ErrorBoundary from '../components/ErrorBoundary'

export default function HomePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        <Home />
      </div>
    </ErrorBoundary>
  )
}

