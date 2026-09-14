import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  isDarkMode: boolean;
  onShowToast: (msg: string) => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ isDarkMode, onShowToast }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState<boolean>(true);
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);

  useEffect(() => {
    // Check if user dismissed the banner previously in this session
    const hasDismissed = sessionStorage.getItem('pwa_banner_dismissed');
    if (!hasDismissed && !isInstalled) {
      // Delay showing banner slightly for smooth initial rendering
      const timer = setTimeout(() => {
        setDismissed(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isInstalled]);

  if (isInstalled || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  const handleAction = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        onShowToast('جاري تثبيت تطبيق أذكار المسلم...');
        setDismissed(true);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <aside
        aria-label="تثبيت التطبيق"
        className={`fixed bottom-24 left-4 right-4 max-w-md mx-auto z-40 rounded-2xl p-4 shadow-2xl transition-all border animate-fadeIn ${
          isDarkMode
            ? 'bg-[#141d18]/95 border-[#3c4a42] text-[#dee4de] backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
            : 'bg-white/95 border-[#e2e8e4] text-[#1b211e] backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
        }`}
      >
        <div className="flex items-center gap-3">
          <img
            src="/pwa-192x192.png"
            alt="أذكار المسلم"
            className="w-11 h-11 rounded-xl shadow-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm leading-tight text-right font-arabic">
              تثبيت تطبيق أذكار المسلم
            </h4>
            <p className="text-xs opacity-75 truncate text-right mt-0.5">
              تصفح الأذكار واستمع للقراء بدون اتصال بالإنترنت
            </p>
          </div>
          <button
            onClick={handleDismiss}
            aria-label="إغلاق التنبيه"
            className={`w-7 h-7 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition ${
              isDarkMode ? 'hover:bg-[#223028]' : 'hover:bg-gray-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-inherit/20">
          <button
            onClick={handleAction}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
              isDarkMode
                ? 'bg-[#10b981] text-[#00281b] hover:bg-[#4edea3]'
                : 'bg-[#0f5132] text-white hover:bg-[#003820]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>تثبيت الآن مجاناً</span>
          </button>
          <button
            onClick={handleDismiss}
            className={`py-2 px-3 rounded-xl font-medium text-xs transition ${
              isDarkMode ? 'text-[#86948a] hover:text-white' : 'text-[#707971] hover:text-black'
            }`}
          >
            لاحقاً
          </button>
        </div>
      </aside>

      {showIOSModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl transition-all ${
              isDarkMode
                ? 'bg-[#141b17] border border-[#3c4a42] text-[#dee4de]'
                : 'bg-white border border-gray-200 text-[#1b211e]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/pwa-192x192.png"
                alt="أذكار المسلم"
                className="w-12 h-12 rounded-xl shadow-md"
              />
              <div>
                <h3 className="font-bold text-base font-arabic">تثبيت التطبيق على آيفون / آيباد</h3>
                <span className="text-xs opacity-75">عبر متصفح Safari</span>
              </div>
            </div>

            <p className="text-xs leading-relaxed my-3 opacity-90">
              لتثبيت التطبيق واستخدامه كتطبيق مستقل:
              <br />
              1. اضغط على أيقونة <strong>المشاركة (Share)</strong> بالأسفل.
              <br />
              2. اختر <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.
              <br />
              3. اضغط <strong>إضافة (Add)</strong> في أعلى الشاشة.
            </p>

            <button
              onClick={() => setShowIOSModal(false)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs mt-2 transition ${
                isDarkMode
                  ? 'bg-[#25332b] hover:bg-[#304037] text-[#dee4de]'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
    </>
  );
};
