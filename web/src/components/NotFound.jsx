import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div className="text-6xl mb-4">🌿</div>
      <h2 className="text-2xl font-light text-gray-900 mb-3">
        {t("pageNotFound")}
      </h2>
      <p className="text-gray-600 mb-6">{t("pageNotFoundDesc")}</p>
      <Link
        href="/"
        className="text-emerald-600 hover:text-emerald-800 font-medium"
      >
        {t("goBackHome")}
      </Link>
    </div>
  );
}
