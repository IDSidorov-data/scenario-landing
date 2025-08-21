import DemoFrame from "@/components/DemoFrame";
import CTAForm from "@/components/CTAForm";

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Демонстрация продукта
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Оцените возможности нашей платформы в действии.
        </p>
      </div>
      <div className="mt-12">
        <DemoFrame />
      </div>
      <div className="mt-16">
        <CTAForm />
      </div>
    </div>
  );
}