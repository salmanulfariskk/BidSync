import { Button } from "antd";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container max-w-5xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900">
            Connect with the Perfect Project Partners
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A seamless platform for buyers to post projects and sellers to showcase their expertise through competitive bidding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button type="primary" size="large" className="h-12 px-8">
              <Link href="/auth/register" className="text-white">
                Get Started
              </Link>
            </Button>
            <Button size="large" className="h-12 px-8">
              <Link href="/auth/login">
                Already have an account
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="flex-1 flex flex-col items-center justify-center py-16 md:py-24 bg-gray-50">
        <div className="container max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="rounded-full bg-blue-50 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Post Your Project</h3>
              <p className="text-gray-600 flex-1">
                Describe your project requirements, set a budget range, and specify the deadline. Get your project in front of skilled sellers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="rounded-full bg-blue-50 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-lg">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Receive Quality Bids</h3>
              <p className="text-gray-600 flex-1">
                Compare bids from sellers who detail their approach, pricing, and estimated completion time. Choose the perfect match for your project.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="rounded-full bg-blue-50 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-lg">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Track & Complete</h3>
              <p className="text-gray-600 flex-1">
                Monitor project progress, exchange files, and provide feedback. Once satisfied, mark the project as complete and leave a review.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-white">
        <div className="container text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join our growing community of buyers and sellers to find the perfect match for your projects or skills.
          </p>
          <Button type="primary" size="large" className="h-12 px-8 bg-white text-blue-600 hover:bg-gray-100">
            <Link href="/auth/register">
              Create an Account
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}