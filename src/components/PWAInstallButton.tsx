import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  isDarkMode: boolean;
  variant?: 'compact' | 'full' | 'banner';
  onShowToast?: (msg: string) => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  isDarkMode,
  variant = 'compact',
  onShowToast,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  // If already running inside installed standalone PWA, suppress install prompts
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted && onShowToast) {
        onShowToast('جزاك الله خيراً! جاري تثبيت التطبيق على جهازك...');
      }
    } else {
      // Show guided instructions for iOS or desktop browsers
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {variant === 'compact' ? (
        <button
          onClick={handleInstallClick}
          id="pwa-install-header-btn"
          aria-label="تثبيت التطبيق على هاتفك"
          title="تثبيت التطبيق على الشاشة الرئيسية للاستخدام دون إنترنت"
          className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
            isDarkMode
              ? 'bg-gradient-to-r from-[#00422b] to-[#10b981] text-white hover:brightness-110 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-[#0f5132] text-white hover:bg-[#003820] shadow-[0_2px_8px_rgba(15,81,50,0.2)]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] transition-transform group-hover:-translate-y-0.5">
            install_mobile
          </span>
          <span className="whitespace-nowrap">تثبيت التطبيق</span>
        </button>
      ) : (
        /* Full or Card variant */
        <button
          onClick={handleInstallClick}
          id="pwa-install-card-btn"
          className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${
            isDarkMode
              ? 'bg-[#10b981] text-[#00281b] hover:bg-[#4edea3] shadow-[0_4px_16px_rgba(16,185,129,0.3)]'
              : 'bg-[#0f5132] text-white hover:bg-[#003820] shadow-[0_4px_12px_rgba(15,81,50,0.25)]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">download_for_offline</span>
          <span>تثبيت تطبيق أذكار المسلم على جهازك</span>
        </button>
      )}

      {/* Guided Installation Modal (for iOS Safari and unsupported browsers) */}
      {showGuideModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl transition-all ${
              isDarkMode
                ? 'bg-[#141b17] border border-[#3c4a42] text-[#dee4de]'
                : 'bg-white border border-gray-200 text-[#1b211e]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with App Icon */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/pwa-192x192.png"
                alt="أذكار المسلم"
                className="w-12 h-12 rounded-xl shadow-md"
              />
              <div className="flex flex-col">
                <h3 className="font-bold text-base font-arabic">تثبيت تطبيق أذكار المسلم</h3>
                <span className="text-xs opacity-75">يعمل بلا إنترنت وبشكل فوري</span>
              </div>
            </div>

            {/* Instruction Steps based on Device */}
            {isIOS ? (
              <div className="space-y-3 my-4 text-xs font-medium leading-relaxed">
                <div
                  className={`p-3 rounded-xl flex items-start gap-3 ${
                    isDarkMode ? 'bg-[#1f2923]' : 'bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px] text-[#10b981]">
                    ios_share
                  </span>
                  <div>
                    <span className="font-bold block text-sm">الخطوة الأولى:</span>
                    اضغط على زر <strong>المشاركة (Share)</strong> في شريط متصفح سفاري بالأسفل.
                  </div>
                </div>

                <div
                  className={`p-3 rounded-xl flex items-start gap-3 ${
                    isDarkMode ? 'bg-[#1f2923]' : 'bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px] text-[#10b981]">
                    add_box
                  </span>
                  <div>
                    <span className="font-bold block text-sm">الخطوة الثانية:</span>
                    مرر للأسفل واختر <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.
                  </div>
                </div>

                <div
                  className={`p-3 rounded-xl flex items-start gap-3 ${
                    isDarkMode ? 'bg-[#1f2923]' : 'bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px] text-[#10b981]">
                    check_circle
                  </span>
                  <div>
                    <span className="font-bold block text-sm">الخطوة الثالثة:</span>
                    اضغط على <strong>إضافة (Add)</strong> في أعلى الزاوية، وسيظهر التطبيق على شاشتك.
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 my-4 text-xs font-medium leading-relaxed">
                <div
                  className={`p-3 rounded-xl flex items-start gap-3 ${
                    isDarkMode ? 'bg-[#1f2923]' : 'bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px] text-[#10b981]">
                    more_vert
                  </span>
                  <div>
                    <span className="font-bold block text-sm">الخطوة الأولى:</span>
                    اضغط على قائمة المتصفح (الثلاث نقاط) في الأعلى.
                  </div>
                </div>

                <div
                  className={`p-3 rounded-xl flex items-start gap-3 ${
                    isDarkMode ? 'bg-[#1f2923]' : 'bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px] text-[#10b981]">
                    install_mobile
                  </span>
                  <div>
                    <span className="font-bold block text-sm">الخطوة الثانية:</span>
                    اضغط على <strong>تثبيت التطبيق (Install app)</strong> أو <strong>الإضافة للشاشة الرئيسية</strong>.
                  </div>
                </div>
              </div>
            )}

            {/* Close action */}
            <button
              onClick={() => setShowGuideModal(false)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs mt-2 transition ${
                isDarkMode
                  ? 'bg-[#25332b] hover:bg-[#304037] text-[#dee4de]'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              تم الفهم، إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
};
