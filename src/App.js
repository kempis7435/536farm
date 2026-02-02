import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  Users,
  Phone,
  User,
  CheckCircle,
  MapPin,
  Info,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  List,
  X,
  Loader2,
  Sparkles,
  Leaf,
  Lock,
  RefreshCw,
  LogOut,
  Facebook,
  Slash,
  Settings,
  Plus,
  Trash2,
  BarChart3,
  PieChart,
  TrendingUp,
  History,
  Star,
  Camera,
  Share2,
  Megaphone,
  Edit3,
  Search,
} from "lucide-react";

// ==========================================
// ★ 1. 圖片與社群設定
// ==========================================
const MY_LOGO_URL = "https://i.meee.com.tw/HnwRiCW.png";
const MY_BG_IMAGE = "https://i.meee.com.tw/9i2VcwM.png";
const MY_HEADER_IMAGE = "https://i.meee.com.tw/rF6Ywpb.jpg";

const FB_PAGE_URL = "https://www.facebook.com/536farm";

// ==========================================
// ★ 2. 系統設定
// ==========================================
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwppQVCiJIZ_VsNLCjahWw_WGmGb340RMBsCwsfPK4DlazRpLafmx4kp6e7zoRA5Rba/exec";

const HOURLY_CAPACITY = 20;
const BLOCK_NAME = "FARM_BLOCK"; // 特殊休園標記
const SETTING_NAME = "SYS_SETTINGS"; // 系統設定標記
const HOLIDAY_NAME = "SYS_HOLIDAY"; // 國定假日標記
const STATUS_NAME = "SYS_FRUIT_STATUS"; // 果況公告標記

const DEFAULT_SETTINGS = {
  weeklyClosed: [1], // 預設週一(1)公休
  weekendOpen: false, // 預設週末不開放
};

const FARM_CONFIG = {
  name: "536無毒草莓園",
  address: "彰化縣芬園鄉嘉中街536號",
  phone: "0911-970993(點我撥打)",
  features: ["溫室高架", "無毒栽種", "雨天可採", "親子友善", "寵物友善"],
  mapUrl:
    "https://maps.google.com/maps?q=彰化縣芬園鄉嘉中街536號&t=&z=15&ie=UTF8&iwloc=&output=embed",
  googleMapLink:
    "https://www.google.com/maps/place/536%E7%84%A1%E6%AF%92%E8%8D%89%E8%8E%93%E8%BE%B2%E5%9C%92/@24.0181939,120.6533761,17z/data=!3m1!4b1!4m6!3m5!1s0x346937e28373206f:0x700e57f58f01710b!8m2!3d24.018189!4d120.655951",
  googleReviewLink:
    "https://www.google.com/maps/place/@24.0164299,120.6560303,17z/data=!4m18!1m9!3m8!1s0x34693b83f1c18a45:0x8001717d1207a9e5!2zNTM254Sh5q-S6I2J6I6T5ZyS77yI5pys5ZySMeaciOS7veeUoumHj-W-iOWwke-8jOebruWJjeWBh-aXpeWPqumWi-mAseWFreaXqeS4ig!8m2!3d24.0164299!4d120.6560303!9m1!1b1!16s%2Fg%2F11h259zj2b!3m7!1s0x34693b83f1c18a45:0x8001717d1207a9e5!8m2!3d24.0164299!4d120.6560303!9m1!1b1!16s%2Fg%2F11h259zj2b?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoASAFQAw%3D%3D",
  openingHours:
    "平日預約09:00 - 16:00，假日免預約09:00 - 17:00 (請留意休園公告)",
};

const TIME_SLOTS = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
];

// --- Styles ---
const styles = {
  container: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: "480px",
    margin: "0 auto",
    minHeight: "100vh",
    position: "relative",
    overflowX: "hidden",
    backgroundImage: `url(${MY_BG_IMAGE})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    backdropFilter: "blur(5px)",
    zIndex: 0,
  },
  content: { position: "relative", zIndex: 1 },
  hero: {
    backgroundImage: `url(${MY_HEADER_IMAGE})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "240px",
    borderRadius: "0 0 30px 30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "20px",
  },
  heroGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)",
    borderRadius: "0 0 30px 30px",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(12px)",
    borderRadius: "24px",
    padding: "20px",
    margin: "15px 20px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.8)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "white",
    margin: "0",
    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
    position: "relative",
    zIndex: 2,
  },
  subtitle: {
    fontSize: "14px",
    color: "white",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "5px",
    marginBottom: "10px",
    opacity: 0.95,
    position: "relative",
    zIndex: 2,
    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
  },
  tag: {
    fontSize: "11px",
    padding: "3px 8px",
    borderRadius: "12px",
    backgroundColor: "rgba(255,255,255,0.9)",
    color: "#D32F2F",
    fontWeight: "bold",
  },
  btnPrimary: {
    width: "100%",
    padding: "16px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(255, 65, 108, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "transform 0.2s",
  },
  btnSecondary: {
    padding: "8px 16px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    background: "white",
    color: "#666",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  dateInput: {
    width: "100%",
    padding: "15px",
    borderRadius: "12px",
    border: "2px solid #ffcdd2",
    background: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
    boxSizing: "border-box",
    marginTop: "8px",
    outline: "none",
    cursor: "pointer",
    backgroundImage: "linear-gradient(to right, #fff, #fff0f5)",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    background: "rgba(255,255,255,0.9)",
    fontSize: "16px",
    boxSizing: "border-box",
    marginTop: "8px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    background: "rgba(255,255,255,0.9)",
    fontSize: "16px",
    boxSizing: "border-box",
    marginTop: "8px",
    outline: "none",
    resize: "none",
  },
  select: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    background: "rgba(255,255,255,0.9)",
    fontSize: "16px",
    boxSizing: "border-box",
    marginTop: "0",
    outline: "none",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#444",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  timeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    marginTop: "10px",
  },
  timeBtn: {
    padding: "15px 0",
    borderRadius: "12px",
    border: "1px solid transparent",
    background: "rgba(255,255,255,0.95)",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    position: "relative",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    color: "#555",
    whiteSpace: "nowrap",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  timeBtnActive: {
    background: "#D32F2F",
    color: "white",
    boxShadow: "0 4px 10px rgba(211, 47, 47, 0.4)",
    border: "1px solid #D32F2F",
  },
  timeBtnDisabled: {
    background: "rgba(200,200,200,0.3)",
    color: "#aaa",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  timeBtnFull: {
    background: "#ffebee",
    color: "#D32F2F",
    cursor: "not-allowed",
    border: "1px solid #ffcdd2",
    boxShadow: "none",
  },
  navBar: {
    padding: "15px 20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    borderBottom: "1px solid rgba(0,0,0,0.05)",
  },
  navBtn: {
    background: "white",
    border: "none",
    padding: "8px",
    borderRadius: "50%",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  stepBar: {
    flex: 1,
    height: "6px",
    background: "#eee",
    borderRadius: "3px",
    overflow: "hidden",
  },
  logoWrapper: {
    background: "white",
    padding: "5px",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  calHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  calGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "5px",
    textAlign: "center",
  },
  calDayLabel: { fontSize: "12px", color: "#888", paddingBottom: "5px" },
  calDayBtn: {
    aspectRatio: "1",
    borderRadius: "10px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flexDirection: "column",
  },
  calDaySelected: {
    background: "#D32F2F",
    color: "white",
    boxShadow: "0 4px 10px rgba(211,47,47,0.3)",
  },
  calDayDisabled: { color: "#ccc", cursor: "not-allowed" },
  calDayBlocked: {
    background: "#ffebee",
    color: "#D32F2F",
    cursor: "not-allowed",
    border: "1px solid #ffcdd2",
  },
  calDayPartial: {
    background: "#fff3e0",
    color: "#E65100",
    border: "1px solid #FFCC80",
  },
  calHolidayText: {
    fontSize: "9px",
    marginTop: "2px",
    color: "#D32F2F",
    fontWeight: "normal",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
  toggleSwitch: {
    width: "40px",
    height: "20px",
    backgroundColor: "#ddd",
    borderRadius: "20px",
    position: "relative",
    cursor: "pointer",
    transition: "0.3s",
  },
  toggleSwitchActive: { backgroundColor: "#4CAF50" },
  toggleKnob: {
    width: "16px",
    height: "16px",
    backgroundColor: "white",
    borderRadius: "50%",
    position: "absolute",
    top: "2px",
    left: "2px",
    transition: "0.3s",
  },
  toggleKnobActive: { left: "22px" },

  // Admin Tabs
  tabBar: {
    display: "flex",
    borderBottom: "1px solid #eee",
    background: "white",
    overflowX: "auto",
  },
  tabItem: {
    flex: 1,
    padding: "15px 5px",
    textAlign: "center",
    fontSize: "13px",
    fontWeight: "bold",
    color: "#999",
    cursor: "pointer",
    borderBottom: "3px solid transparent",
    whiteSpace: "nowrap",
    minWidth: "70px",
  },
  tabItemActive: { color: "#D32F2F", borderBottom: "3px solid #D32F2F" },

  // Stats
  statCard: {
    background: "white",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginBottom: "10px",
    flex: 1,
  },
  chartBarContainer: {
    display: "flex",
    alignItems: "flex-end",
    height: "150px",
    gap: "8px",
    padding: "10px 0",
    overflowX: "auto",
  },
  chartBarWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "30px",
  },
  chartBar: {
    width: "100%",
    backgroundColor: "#FF8A80",
    borderRadius: "4px 4px 0 0",
    transition: "height 0.3s",
    minHeight: "4px",
  },
  chartLabel: {
    fontSize: "10px",
    color: "#666",
    marginTop: "5px",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  chartValue: {
    fontSize: "10px",
    color: "#333",
    marginBottom: "2px",
    fontWeight: "bold",
  },
};

export default function App() {
  const [view, setView] = useState("home");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: 2,
    name: "",
    phone: "",
    note: "",
  });
  const [bookings, setBookings] = useState([]);

  // ★ 顧客查詢相關 State
  const [searchPhone, setSearchPhone] = useState("");

  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  // 後台分頁狀態 ('bookings', 'history', 'stats', 'settings', 'status')
  const [adminTab, setAdminTab] = useState("bookings");

  // 設定相關狀態
  const [blockDate, setBlockDate] = useState("");
  const [blockType, setBlockType] = useState("整日休園");
  const [globalSettings, setGlobalSettings] = useState(DEFAULT_SETTINGS);
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState({
    date: "",
    name: "",
    open: false,
  });

  // ★ 果況公告狀態
  const [fruitStatus, setFruitStatus] = useState(
    "目前一月份產量較少，假日僅營業周六上午，農曆年前後開始第二期花果！"
  ); // 預設訊息
  const [newStatusMsg, setNewStatusMsg] = useState("");

  // 統計相關狀態 ('daily', 'weekly', 'monthly')
  const [statsView, setStatsView] = useState("daily");

  const [calDate, setCalDate] = useState(new Date());
  const todayStr = new Date().toISOString().split("T")[0];

  // --- 解析資料 ---
  useEffect(() => {
    if (bookings.length > 0) {
      // 1. 系統設定
      const settingEntry = bookings.find((b) => b.name === SETTING_NAME);
      if (settingEntry && settingEntry.note) {
        try {
          const parsed = JSON.parse(settingEntry.note);
          setGlobalSettings(parsed);
        } catch (e) {
          console.error(e);
        }
      }
      // 2. 國定假日 (修正：強制轉型為數字，確保 Open 判斷正確)
      const holidayEntries = bookings
        .filter((b) => b.name === HOLIDAY_NAME)
        .map((b) => ({
          id: b.id,
          date: b.date,
          name: b.phone,
          open: parseInt(b.guests || 0) === 1,
        }));
      setHolidays(holidayEntries);

      // 3. ★ 解析果況公告 (修正：取最新的，而非列表中的第一個)
      const statusEntries = bookings.filter((b) => b.name === STATUS_NAME);
      if (statusEntries.length > 0) {
        // 按 createdAt 倒序排列 (最新的在最前面)
        statusEntries.sort((a, b) => {
          // 安全檢查：若 createdAt 不存在，視為最舊的時間 (0)
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        });
        const newestStatus = statusEntries[0];
        if (newestStatus && newestStatus.note) {
          setFruitStatus(newestStatus.note);
        }
      }
    }
  }, [bookings]);

  // ★ 自動載入資料：當切換到查詢頁面時，自動抓取最新資料
  useEffect(() => {
    if (view === "search") {
      fetchSheetData();
    }
  }, [view]);

  // ★ 即時篩選：根據輸入的電話號碼，自動篩選 bookings
  const filteredCustomerBookings = useMemo(() => {
    // 門檻提高：至少輸入 9 碼才開始篩選，防止資料外洩
    if (!searchPhone || searchPhone.length < 9) return null;
    return bookings
      .filter(
        (b) =>
          b.phone &&
          b.phone.includes(searchPhone) &&
          b.name !== BLOCK_NAME &&
          b.name !== SETTING_NAME &&
          b.name !== HOLIDAY_NAME &&
          b.name !== STATUS_NAME
      )
      .sort((a, b) => {
        // 安全檢查
        const dateA = a.date || "";
        const dateB = b.date || "";
        return dateB.localeCompare(dateA);
      });
  }, [bookings, searchPhone]);

  // --- 邏輯函數 ---
  const getBookedCount = (date, time) => {
    if (!date || !time) return 0;
    return bookings
      .filter(
        (b) =>
          b.date &&
          b.date.includes(date) &&
          b.time === time &&
          b.name !== BLOCK_NAME &&
          b.name !== SETTING_NAME &&
          b.name !== HOLIDAY_NAME &&
          b.name !== STATUS_NAME
      )
      .reduce((sum, b) => sum + parseInt(b.guests || 0), 0);
  };

  const checkIsBlocked = (date, slotTime) => {
    const blocks = bookings.filter(
      (b) => b.date === date && b.name === BLOCK_NAME
    );
    const morningSlots = ["09:00", "10:00", "11:00"];
    const afternoonSlots = ["13:00", "14:00", "15:00", "16:00"];
    for (let block of blocks) {
      if (block.time === "整日休園") return true;
      if (
        block.time === "上午休園" &&
        morningSlots.some((h) => slotTime.startsWith(h))
      )
        return true;
      if (
        block.time === "下午休園" &&
        afternoonSlots.some((h) => slotTime.startsWith(h))
      )
        return true;
    }
    return false;
  };

  const isDateAvailable = (dateStr) => {
    const dateObj = new Date(dateStr);
    const dayOfWeek = dateObj.getDay();
    const holiday = holidays.find((h) => h.date === dateStr);
    if (holiday) return holiday.open;
    const isManualBlocked = bookings.some(
      (b) =>
        b.date === dateStr && b.name === BLOCK_NAME && b.time === "整日休園"
    );
    if (isManualBlocked) return false;
    if (dayOfWeek === 0 || dayOfWeek === 6) return globalSettings.weekendOpen;
    if (globalSettings.weeklyClosed.includes(dayOfWeek)) return false;
    return true;
  };

  const handleDateChange = (e) => {
    const val = e.target.value;
    if (!val) {
      setFormData((prev) => ({ ...prev, date: "" }));
      return;
    }
    if (!isDateAvailable(val)) {
      const holiday = holidays.find((h) => h.date === val);
      if (holiday && !holiday.open)
        alert(`抱歉，${val} 是 ${holiday.name}，當日不開放預約。`);
      else if (bookings.some((b) => b.date === val && b.name === BLOCK_NAME))
        alert("抱歉，該日園主已設定特別休園。");
      else {
        const day = new Date(val).getDay();
        if (day === 0 || day === 6)
          alert("抱歉，假日目前不開放線上預約，請現場候位。");
        else alert("抱歉，該日為固定公休日。");
      }
      setFormData((prev) => ({ ...prev, date: "" }));
      return;
    }
    setFormData((prev) => ({ ...prev, date: val }));
  };

  const submitBooking = async () => {
    if (!formData.name || !formData.phone) return;
    const currentBooked = getBookedCount(formData.date, formData.time);
    if (currentBooked + formData.guests > HOURLY_CAPACITY) {
      alert("抱歉！該時段已額滿。");
      return;
    }
    setIsSubmitting(true);
    const newBooking = {
      id: "BK" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      createdAt: new Date().toISOString(),
      status: "confirmed",
      ...formData,
    };
    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBooking),
        });
      } catch (e) {
        console.error(e);
      }
    }
    setTimeout(() => {
      setBookings((prev) => [newBooking, ...prev]);
      setIsSubmitting(false);
      setView("success");
    }, 1500);
  };

  const fetchSheetData = async () => {
    if (!GOOGLE_SCRIPT_URL) {
      setFetchError(true);
      return;
    }
    setIsLoadingData(true);
    setFetchError(false);
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();
      if (Array.isArray(data)) setBookings(data);
    } catch (error) {
      setFetchError(true);
    } finally {
      setIsLoadingData(false);
    }
  };

  const saveGlobalSettings = async (newSettings) => {
    const settingData = {
      id: "SETTING-" + Date.now(),
      date: todayStr,
      time: "SYSTEM",
      name: SETTING_NAME,
      phone: "admin",
      guests: 0,
      note: JSON.stringify(newSettings),
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [settingData, ...prev]);
    setGlobalSettings(newSettings);
    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settingData),
        });
      } catch (e) {}
    }
  };

  const addHoliday = async () => {
    if (!newHoliday.date || !newHoliday.name) return;
    const holidayData = {
      id: "HOLIDAY-" + newHoliday.date,
      date: newHoliday.date,
      time: "ALL",
      name: HOLIDAY_NAME,
      phone: newHoliday.name,
      guests: newHoliday.open ? 1 : 0,
      note: "國定假日",
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [holidayData, ...prev]);
    setNewHoliday({ date: "", name: "", open: false });
    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(holidayData),
        });
      } catch (e) {}
    }
  };

  // ★ 發布果況公告
  const saveFruitStatus = async () => {
    if (!newStatusMsg) return;
    if (!window.confirm("確定發布此公告嗎？")) return;

    const statusData = {
      id: "STATUS-" + Date.now(),
      date: todayStr,
      time: "SYSTEM",
      name: STATUS_NAME,
      phone: "admin",
      guests: 0,
      note: newStatusMsg,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [statusData, ...prev]); // 本地更新
    setFruitStatus(newStatusMsg);
    setNewStatusMsg("");
    alert("公告已發布！");

    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(statusData),
        });
      } catch (e) {}
    }
  };

  const submitBlockDate = async () => {
    if (!blockDate) return;
    const blockData = {
      id: "BLOCK-" + blockDate + "-" + Date.now(),
      date: blockDate,
      time: blockType,
      name: BLOCK_NAME,
      phone: "admin",
      guests: 0,
      note: "休園",
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [blockData, ...prev]);
    setBlockDate("");
    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blockData),
        });
      } catch (e) {}
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === "0916") {
      setIsAuthenticated(true);
      fetchSheetData();
    } else {
      alert("密碼錯誤");
    }
  };

  const handleSocialClick = (url, type) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      if (type === "fb_checkin") {
        window.location.href = `fb://facewebmodal/f?href=${encodeURIComponent(
          "https://www.facebook.com/536farm"
        )}`;
        setTimeout(() => {
          window.open("https://www.facebook.com/536farm", "_blank");
        }, 800);
        return;
      }
      if (type === "ig_checkin") {
        window.location.href = "instagram://camera";
        setTimeout(() => {
          window.open("https://www.instagram.com/536farmer/", "_blank");
        }, 800);
        return;
      }
    }
    window.open(url, "_blank");
  };

  // --- 統計邏輯 ---
  const calculateStats = useMemo(() => {
    const validBookings = bookings.filter(
      (b) =>
        b.name !== BLOCK_NAME &&
        b.name !== SETTING_NAME &&
        b.name !== HOLIDAY_NAME &&
        b.name !== STATUS_NAME &&
        b.date
    );
    const result = [];
    const now = new Date();
    if (statsView === "daily") {
      for (let i = -7; i < 7; i++) {
        const d = new Date();
        d.setDate(now.getDate() + i);
        const dStr = d.toISOString().split("T")[0];
        const count = validBookings
          .filter((b) => b.date === dStr)
          .reduce((sum, b) => sum + parseInt(b.guests || 0), 0);
        result.push({ label: dStr.slice(5), fullDate: dStr, count: count });
      }
    } else if (statsView === "monthly") {
      for (let i = 0; i < 6; i++) {
        const d = new Date();
        d.setMonth(now.getMonth() - 2 + i);
        const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        const count = validBookings
          .filter((b) => b.date.startsWith(mStr))
          .reduce((sum, b) => sum + parseInt(b.guests || 0), 0);
        result.push({ label: mStr, count: count });
      }
    }
    return result;
  }, [bookings, statsView]);

  const CustomCalendar = () => {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // ★ 修正：點擊日曆時需進行驗證 (針對綠色但不開放的假日/週末)
    const handleDayClick = (day) => {
      const selectedStr = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;

      // 如果該日期不開放 (例如週末/國定假日設定為休息，但顯示綠色)
      if (!isDateAvailable(selectedStr)) {
        const holiday = holidays.find((h) => h.date === selectedStr);
        const dObj = new Date(selectedStr);
        const dayOfWeek = dObj.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        if (holiday && !holiday.open) {
          alert(
            `抱歉，${selectedStr} 是 ${holiday.name}，當日不開放線上預約 (僅現場候位)。`
          );
        } else if (isWeekend && !globalSettings.weekendOpen) {
          alert("抱歉，假日目前不開放線上預約，請現場候位。");
        } else if (
          bookings.some((b) => b.date === selectedStr && b.name === BLOCK_NAME)
        ) {
          alert("抱歉，該日園主已設定特別休園。");
        } else {
          alert("抱歉，該日為固定公休日。");
        }
        return;
      }

      setFormData({ ...formData, date: selectedStr });
    };

    return (
      <div>
        <div style={styles.calHeader}>
          <button
            onClick={() => setCalDate(new Date(year, month - 1, 1))}
            style={styles.navBtn}
          >
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontWeight: "bold", color: "#333" }}>
            {year}年 {month + 1}月
          </span>
          <button
            onClick={() => setCalDate(new Date(year, month + 1, 1))}
            style={styles.navBtn}
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div style={styles.calGrid}>
          {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
            <div key={d} style={styles.calDayLabel}>
              {d}
            </div>
          ))}
          {blanks.map((_, i) => (
            <div key={`blank-${i}`}></div>
          ))}
          {days.map((day) => {
            const currentStr = `${year}-${String(month + 1).padStart(
              2,
              "0"
            )}-${String(day).padStart(2, "0")}`;
            const dateObj = new Date(currentStr);
            const dayOfWeek = dateObj.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            const isPast = currentStr < todayStr;
            const holiday = holidays.find((h) => h.date === currentStr);
            const available = isDateAvailable(currentStr);
            const blocks = bookings.filter(
              (b) => b.date === currentStr && b.name === BLOCK_NAME
            );
            const isManualBlock = blocks.some((b) => b.time === "整日休園"); // 檢查是否手動整日休園
            const isPartialBlock =
              blocks.length > 0 && available && !isManualBlock;
            const isSelected = formData.date === currentStr;

            let btnStyle = { ...styles.calDayBtn };

            if (isSelected) {
              btnStyle = { ...btnStyle, ...styles.calDaySelected };
            } else if (isPast) {
              btnStyle = { ...btnStyle, ...styles.calDayDisabled };
            } else if (isManualBlock) {
              // 手動休園 (優先權最高) -> 紅色
              btnStyle = { ...btnStyle, ...styles.calDayBlocked };
            } else if (holiday || isWeekend) {
              // ★ 國定假日 或 週末 -> 強制綠色 (即使不開放)
              // 若不開放，已在 handleDayClick 阻擋並跳 Alert
              btnStyle = {
                ...btnStyle,
                background: "#E8F5E9",
                color: "#2E7D32",
                border: "1px solid #4CAF50",
              };
            } else if (!available) {
              // 其他平日不開放日 (例如週一公休) -> 紅色
              btnStyle = { ...btnStyle, ...styles.calDayBlocked };
            } else if (isPartialBlock) {
              // 部分時段休園 -> 橘色
              btnStyle = { ...btnStyle, ...styles.calDayPartial };
            }

            return (
              <button
                key={day}
                style={btnStyle}
                disabled={isPast || (!available && !holiday && !isWeekend)}
                onClick={() => handleDayClick(day)}
              >
                {day}
                {holiday && (
                  <div style={styles.calHolidayText}>{holiday.name}</div>
                )}
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "10px",
            fontSize: "11px",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            color: "#666",
            flexWrap: "wrap",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <span
              style={{
                width: 8,
                height: 8,
                background: "#ffebee",
                border: "1px solid #ffcdd2",
                borderRadius: "2px",
              }}
            ></span>{" "}
            休園
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <span
              style={{
                width: 8,
                height: 8,
                background: "#E8F5E9",
                border: "1px solid #4CAF50",
                borderRadius: "2px",
              }}
            ></span>{" "}
            假日/國定假日
          </span>
        </div>
      </div>
    );
  };

  // --- Render Views ---
  const renderHome = () => (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        <div style={styles.hero}>
          <div style={styles.heroGradient}></div>
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              zIndex: 5,
            }}
          >
            <div style={styles.logoWrapper}>
              {MY_LOGO_URL ? (
                <img
                  src={MY_LOGO_URL}
                  alt="logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Sparkles style={{ color: "#D32F2F", width: 30, height: 30 }} />
              )}
            </div>
          </div>
          <h1 style={styles.title}>{FARM_CONFIG.name}</h1>
          <div style={styles.subtitle}>
            <MapPin size={14} /> {FARM_CONFIG.address}
            <span style={{ margin: "0 5px", opacity: 0.7 }}>|</span>
            <a
              href={`tel:${FARM_CONFIG.phone}`}
              style={{
                color: "white",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                borderBottom: "1px dotted white",
              }}
            >
              <Phone size={14} /> {FARM_CONFIG.phone}
            </a>
          </div>
        </div>
        <div
          style={{
            ...styles.card,
            marginTop: "-30px",
            position: "relative",
            zIndex: 5,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {FARM_CONFIG.features.map((t) => (
                <span key={t} style={styles.tag}>
                  #{t}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
            <div
              style={{
                background: "#ffebee",
                padding: "10px",
                borderRadius: "10px",
                color: "#D32F2F",
              }}
            >
              <Clock />
            </div>
            <div>
              <div style={{ fontWeight: "bold", color: "#333" }}>營業時間</div>
              <div style={{ fontSize: "13px", color: "#666" }}>
                {FARM_CONFIG.openingHours}
              </div>
            </div>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <iframe
              width="100%"
              height="150px"
              frameBorder="0"
              src={FARM_CONFIG.mapUrl}
              style={{ borderRadius: "15px" }}
              title="Map"
            ></iframe>
          </div>

          {/* 果況公告區塊 */}
          <div
            style={{
              background: "#FFF3E0",
              padding: "12px",
              borderRadius: "12px",
              marginBottom: "15px",
              borderLeft: "4px solid #FF9800",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            }}
          >
            <Megaphone
              size={20}
              color="#F57C00"
              style={{ marginTop: "2px", flexShrink: 0 }}
            />
            <div>
              <div
                style={{
                  fontWeight: "bold",
                  color: "#E65100",
                  fontSize: "13px",
                  marginBottom: "2px",
                }}
              >
                最新果況公告
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#333",
                  lineHeight: "1.4",
                  whiteSpace: "pre-wrap",
                }}
              >
                {fruitStatus}
              </div>
            </div>
          </div>

          {/* ★ 調整後的按鈕區塊 (並排) */}
          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button
              style={{ ...styles.btnPrimary, flex: 1, margin: 0 }}
              onClick={() => setView("booking")}
            >
              立即預約採果 <ArrowRight />
            </button>
            {/* 縮小的查詢按鈕 */}
            <button
              style={{
                ...styles.btnSecondary,
                width: "auto",
                padding: "0 15px",
                border: "1px solid #D32F2F",
                color: "#D32F2F",
                background: "white",
                flexDirection: "column",
                gap: "2px",
                fontSize: "12px",
                justifyContent: "center",
              }}
              onClick={() => setView("search")}
            >
              <Search size={20} /> 查詢
            </button>
          </div>
        </div>

        {/* 評價與打卡區塊 */}
        <div style={styles.card}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <Sparkles size={20} color="#FFD700" fill="#FFD700" />
            <div style={{ fontWeight: "bold", color: "#333" }}>支持與分享</div>
          </div>

          <a
            href={FARM_CONFIG.googleReviewLink}
            target="_blank"
            rel="noreferrer"
            style={{
              ...styles.btnSecondary,
              background: "#fff",
              border: "1px solid #ddd",
              justifyContent: "center",
              marginBottom: "10px",
              textDecoration: "none",
              color: "#333",
              fontWeight: "bold",
              padding: "12px",
            }}
          >
            <Star
              size={18}
              fill="#FFD700"
              color="#FFD700"
              style={{ marginRight: "5px" }}
            />{" "}
            給予 Google 五星好評
          </a>

          <div style={{ display: "flex", gap: "10px" }}>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                FB_PAGE_URL
              )}`}
              target="_blank"
              rel="noreferrer"
              style={{
                ...styles.btnSecondary,
                flex: 1,
                background: "#1877F2",
                color: "white",
                border: "none",
                justifyContent: "center",
                textDecoration: "none",
                padding: "12px",
              }}
            >
              <Facebook size={18} style={{ marginRight: "5px" }} /> FB 打卡
            </a>
            <button
              onClick={() =>
                handleSocialClick(
                  "https://www.instagram.com/536farmer/",
                  "ig_checkin"
                )
              }
              style={{
                ...styles.btnSecondary,
                flex: 1,
                background:
                  "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                color: "white",
                border: "none",
                justifyContent: "center",
                textDecoration: "none",
                padding: "12px",
              }}
            >
              <Camera size={18} style={{ marginRight: "5px" }} /> IG 打卡
            </button>
          </div>
        </div>

        <div style={styles.card}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <Facebook size={20} color="#1877F2" />
            <div style={{ fontWeight: "bold", color: "#333" }}>最新動態</div>
          </div>
          <div
            style={{
              width: "100%",
              overflow: "hidden",
              borderRadius: "12px",
              background: "#f0f2f5",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <iframe
              src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
                FB_PAGE_URL
              )}&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`}
              width="340"
              height="500"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              title="FB Page"
            ></iframe>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <button
            onClick={() => setView("admin")}
            style={{
              border: "none",
              background: "rgba(255,255,255,0.5)",
              padding: "8px 15px",
              borderRadius: "20px",
              color: "#555",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              margin: "0 auto",
              cursor: "pointer",
              backdropFilter: "blur(5px)",
            }}
          >
            <Lock size={12} /> 園主管理
          </button>
        </div>
      </div>
    </div>
  );

  // ★ 新增：顧客查詢頁面 (自動篩選)
  const renderSearch = () => (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        <div style={styles.navBar}>
          <button
            style={styles.navBtn}
            onClick={() => {
              setView("home");
              setSearchPhone("");
            }}
          >
            <ChevronLeft color="#555" />
          </button>
          <div style={{ fontWeight: "bold", color: "#333" }}>查詢預約紀錄</div>
        </div>

        <div style={{ padding: "20px" }}>
          <div style={styles.card}>
            <div style={styles.label}>
              <Phone size={18} /> 輸入預約電話
              {isLoadingData && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#D32F2F",
                    marginLeft: "auto",
                  }}
                >
                  資料更新中...
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="tel"
                placeholder="請輸入完整手機號碼 (自動搜尋)"
                style={{ ...styles.input, marginTop: "8px" }}
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />
            </div>
          </div>

          {/* 顯示結果區域 */}
          <div style={{ marginTop: "20px" }}>
            {searchPhone.length < 9 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#999",
                  background: "rgba(255,255,255,0.8)",
                  borderRadius: "12px",
                }}
              >
                請輸入至少 9 碼電話號碼以查詢
              </div>
            ) : filteredCustomerBookings &&
              filteredCustomerBookings.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#999",
                  background: "rgba(255,255,255,0.8)",
                  borderRadius: "12px",
                }}
              >
                {isLoadingData ? (
                  <Loader2
                    className="animate-spin"
                    style={{ margin: "0 auto" }}
                  />
                ) : (
                  "查無資料，請確認號碼。"
                )}
              </div>
            ) : (
              filteredCustomerBookings &&
              filteredCustomerBookings.map((booking) => {
                const isPast = booking.date < todayStr;
                return (
                  <div
                    key={booking.id}
                    style={{
                      background: isPast ? "#f5f5f5" : "white",
                      padding: "20px",
                      borderRadius: "16px",
                      marginBottom: "15px",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                      borderLeft: isPast
                        ? "5px solid #999"
                        : "5px solid #D32F2F",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {isPast && (
                      <div
                        style={{
                          position: "absolute",
                          right: "-25px",
                          top: "10px",
                          background: "#ccc",
                          color: "white",
                          padding: "2px 30px",
                          transform: "rotate(45deg)",
                          fontSize: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        已過期
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "18px",
                          color: "#333",
                        }}
                      >
                        {booking.date}
                      </div>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "18px",
                          color: isPast ? "#999" : "#D32F2F",
                        }}
                      >
                        {booking.time}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        fontSize: "14px",
                        color: "#555",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <User size={14} /> {booking.name}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <Users size={14} /> {booking.guests}位
                      </div>
                    </div>

                    {booking.note && (
                      <div
                        style={{
                          marginTop: "10px",
                          background: isPast ? "#e0e0e0" : "#FFF3E0",
                          padding: "8px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          color: "#666",
                        }}
                      >
                        備註：{booking.note}
                      </div>
                    )}
                    <div
                      style={{
                        marginTop: "15px",
                        borderTop: "1px dashed #ddd",
                        paddingTop: "10px",
                        fontSize: "10px",
                        color: "#aaa",
                        textAlign: "right",
                      }}
                    >
                      單號：{booking.id}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBooking = () => (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        <div style={styles.navBar}>
          <button
            style={styles.navBtn}
            onClick={() => (step === 1 ? setView("home") : setStep(1))}
          >
            <ChevronLeft color="#555" />
          </button>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "5px",
                color: "#333",
              }}
            >
              {step === 1 ? "選擇時間" : "聯絡資料"}
            </div>
            <div style={styles.stepBar}>
              <div
                style={{
                  ...styles.stepProgress,
                  width: step === 1 ? "50%" : "100%",
                }}
              ></div>
            </div>
          </div>
        </div>
        <div style={{ padding: "20px", paddingBottom: "80px" }}>
          {step === 1 ? (
            <React.Fragment>
              <div style={styles.card}>
                <div style={styles.label}>
                  <Calendar size={18} color="#D32F2F" /> 預約日期
                </div>
                <div style={{ marginTop: "10px" }}>
                  <CustomCalendar />
                </div>
                {!formData.date && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#E65100",
                      marginTop: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Info size={12} /> 請點選日期
                  </div>
                )}
              </div>
              <div style={styles.card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={styles.label}>
                    <Users size={18} color="#D32F2F" /> 人數
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    {formData.guests}
                  </div>
                </div>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  <button
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        guests: Math.max(1, p.guests - 1),
                      }))
                    }
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                      background: "white",
                      fontSize: "20px",
                    }}
                  >
                    -
                  </button>
                  <button
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        guests: Math.min(20, p.guests + 1),
                      }))
                    }
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #ffcdd2",
                      background: "#ffebee",
                      color: "#D32F2F",
                      fontSize: "20px",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <div style={styles.card}>
                <div style={styles.label}>
                  <Clock size={18} color="#D32F2F" /> 時段
                </div>
                {!formData.date ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#999",
                      padding: "20px",
                    }}
                  >
                    請先選擇日期
                  </div>
                ) : (
                  <div style={styles.timeGrid}>
                    {TIME_SLOTS.map((t) => {
                      const booked = getBookedCount(formData.date, t);
                      const remaining = HOURLY_CAPACITY - booked;
                      const isTimeBlocked = checkIsBlocked(formData.date, t);
                      const isFull = remaining <= 0;
                      const isNotEnough = remaining < formData.guests;
                      const disabled = isFull || isNotEnough || isTimeBlocked;
                      const active = formData.time === t;
                      let btnStyle = { ...styles.timeBtn };
                      if (active)
                        btnStyle = { ...btnStyle, ...styles.timeBtnActive };
                      else if (isTimeBlocked || isFull)
                        btnStyle = { ...btnStyle, ...styles.timeBtnFull };
                      else if (disabled)
                        btnStyle = { ...btnStyle, ...styles.timeBtnDisabled };
                      return (
                        <button
                          key={t}
                          disabled={disabled}
                          onClick={() => setFormData({ ...formData, time: t })}
                          style={btnStyle}
                        >
                          <span style={{ zIndex: 1 }}>{t}</span>
                          {!disabled && remaining <= 5 && (
                            <div
                              style={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                background: "#FF9800",
                                color: "white",
                                fontSize: "10px",
                                padding: "2px 6px",
                                borderRadius: "10px",
                                zIndex: 2,
                              }}
                            >
                              剩{remaining}
                            </div>
                          )}
                          {isTimeBlocked && (
                            <div
                              style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                                marginTop: "2px",
                              }}
                            >
                              休息
                            </div>
                          )}
                          {!isTimeBlocked && isFull && (
                            <div
                              style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                                marginTop: "2px",
                              }}
                            >
                              已額滿
                            </div>
                          )}
                          {!isTimeBlocked && !isFull && isNotEnough && (
                            <div style={{ fontSize: "12px", marginTop: "2px" }}>
                              名額不足
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div style={{ marginTop: "20px" }}>
                <button
                  disabled={!formData.date || !formData.time}
                  style={{
                    ...styles.btnPrimary,
                    opacity: !formData.date || !formData.time ? 0.5 : 1,
                  }}
                  onClick={() => setStep(2)}
                >
                  下一步
                </button>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div style={styles.card}>
                <div style={styles.label}>
                  <User size={18} /> 姓名
                </div>
                <input
                  type="text"
                  placeholder="王小明"
                  style={styles.input}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <div style={{ ...styles.label, marginTop: "15px" }}>
                  <Phone size={18} /> 電話
                </div>
                <input
                  type="tel"
                  placeholder="0912345678"
                  style={styles.input}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                <div style={{ ...styles.label, marginTop: "15px" }}>備註</div>
                <textarea
                  rows="3"
                  style={styles.input}
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                />
              </div>
              <div style={{ marginTop: "20px" }}>
                <button
                  disabled={!formData.name || !formData.phone || isSubmitting}
                  onClick={submitBooking}
                  style={{
                    ...styles.btnPrimary,
                    opacity: !formData.name || !formData.phone ? 0.5 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <React.Fragment>
                      <Loader2 className="animate-spin" /> 處理中...
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <CheckCircle /> 確認預約
                    </React.Fragment>
                  )}
                </button>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div
      style={{
        ...styles.container,
        backgroundImage: "none",
        backgroundColor: "#1a1a1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <div
        style={{
          background: "#4CAF50",
          borderRadius: "50%",
          padding: "20px",
          marginBottom: "20px",
          boxShadow: "0 0 30px rgba(76, 175, 80, 0.4)",
        }}
      >
        <CheckCircle size={40} color="white" />
      </div>
      <h2 style={{ fontSize: "24px", margin: 0 }}>預約成功！</h2>
      <p style={{ color: "#aaa", marginBottom: "30px" }}>請截圖保存此憑證</p>
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          overflow: "hidden",
          width: "85%",
          maxWidth: "350px",
          color: "black",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(45deg, #FF416C, #FF4B2B)",
            padding: "20px",
            color: "white",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "12px", letterSpacing: "2px", opacity: 0.9 }}>
            ADMIT ONE
          </div>
          <div
            style={{ fontSize: "20px", fontWeight: "bold", marginTop: "5px" }}
          >
            {FARM_CONFIG.name}
          </div>
        </div>
        <div style={{ padding: "25px", position: "relative" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "2px dashed #eee",
              paddingBottom: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <div style={{ fontSize: "12px", color: "#999" }}>DATE</div>
              <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                {bookings[0]?.date}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", color: "#999" }}>TIME</div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#D32F2F",
                }}
              >
                {bookings[0]?.time}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "12px", color: "#999" }}>NAME</div>
              <div style={{ fontWeight: "bold" }}>{bookings[0]?.name}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", color: "#999" }}>GUESTS</div>
              <div style={{ fontWeight: "bold" }}>{bookings[0]?.guests} 位</div>
            </div>
          </div>
          <div
            style={{
              marginTop: "20px",
              fontSize: "12px",
              color: "#ccc",
              textAlign: "center",
              fontFamily: "monospace",
            }}
          >
            NO. {bookings[0]?.id}
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          setFormData({
            date: "",
            time: "",
            guests: 2,
            name: "",
            phone: "",
            note: "",
          });
          setStep(1);
          setView("home");
        }}
        style={{
          marginTop: "40px",
          background: "transparent",
          border: "1px solid #555",
          color: "white",
          padding: "12px 30px",
          borderRadius: "30px",
          cursor: "pointer",
        }}
      >
        返回首頁
      </button>
    </div>
  );

  // --- 管理後台子頁面 ---

  // 1. 預約清單 (未來的) - Grouped by Date
  const renderAdminBookings = () => {
    const upcomingBookings = bookings.filter(
      (b) =>
        b.date >= todayStr &&
        b.name !== BLOCK_NAME &&
        b.name !== SETTING_NAME &&
        b.name !== HOLIDAY_NAME &&
        b.name !== STATUS_NAME
    );
    const grouped = upcomingBookings.reduce((acc, curr) => {
      if (!acc[curr.date]) acc[curr.date] = [];
      acc[curr.date].push(curr);
      return acc;
    }, {});
    const sortedDates = Object.keys(grouped).sort();

    return (
      <div style={{ padding: "20px" }}>
        <h3
          style={{
            marginTop: 0,
            marginBottom: "15px",
            color: "#666",
            fontSize: "14px",
          }}
        >
          未來預約 (共 {upcomingBookings.length} 筆)
        </h3>
        {sortedDates.length === 0 && !isLoadingData ? (
          <div
            style={{ textAlign: "center", color: "#999", marginTop: "50px" }}
          >
            目前沒有未來的預約資料
          </div>
        ) : (
          sortedDates.map((date) => (
            <div key={date} style={{ marginBottom: "25px" }}>
              <div
                style={{
                  background: "#e0e0e0",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#333",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {date}{" "}
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "normal",
                      marginLeft: "5px",
                    }}
                  >
                    週
                    {
                      ["日", "一", "二", "三", "四", "五", "六"][
                        new Date(date).getDay()
                      ]
                    }
                  </span>
                </span>
                <span
                  style={{
                    background: "white",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                >
                  {grouped[date].length} 組
                </span>
              </div>
              {grouped[date]
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((b, i) => (
                  <div
                    key={i}
                    style={{
                      background: "white",
                      padding: "15px",
                      borderRadius: "15px",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      borderLeft: "4px solid #D32F2F",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          color: "#333",
                        }}
                      >
                        {b.name}{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "normal",
                            color: "#666",
                            background: "#f5f5f5",
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          {" "}
                          {b.guests}人
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#666",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          marginTop: "4px",
                        }}
                      >
                        <Phone size={12} /> {b.phone}
                      </div>
                      {b.note && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#888",
                            marginTop: "4px",
                            background: "#fff3e0",
                            padding: "4px",
                            borderRadius: "4px",
                          }}
                        >
                          備註: {b.note}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#D32F2F",
                          fontSize: "16px",
                        }}
                      >
                        {b.time}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))
        )}
      </div>
    );
  };

  // 2. 歷史紀錄 (全部) - Grouped by Date (Descending)
  const renderAdminHistory = () => {
    const allBookings = bookings.filter(
      (b) =>
        b.name !== BLOCK_NAME &&
        b.name !== SETTING_NAME &&
        b.name !== HOLIDAY_NAME &&
        b.name !== STATUS_NAME
    );
    const grouped = allBookings.reduce((acc, curr) => {
      if (!acc[curr.date]) acc[curr.date] = [];
      acc[curr.date].push(curr);
      return acc;
    }, {});
    const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

    return (
      <div style={{ padding: "20px" }}>
        <h3
          style={{
            marginTop: 0,
            marginBottom: "15px",
            color: "#666",
            fontSize: "14px",
          }}
        >
          所有預約紀錄 (共 {allBookings.length} 筆)
        </h3>
        {sortedDates.length === 0 && !isLoadingData ? (
          <div
            style={{ textAlign: "center", color: "#999", marginTop: "50px" }}
          >
            目前沒有任何資料
          </div>
        ) : (
          sortedDates.map((date) => {
            const isPast = date < todayStr;
            return (
              <div key={date} style={{ marginBottom: "25px" }}>
                <div
                  style={{
                    background: isPast ? "#eee" : "#e0e0e0",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: isPast ? "#777" : "#333",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    {date} {isPast && "(過去)"}
                  </span>
                  <span
                    style={{
                      background: "white",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      fontSize: "12px",
                    }}
                  >
                    {grouped[date].length} 組
                  </span>
                </div>
                {grouped[date]
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((b, i) => (
                    <div
                      key={i}
                      style={{
                        background: isPast ? "#f9f9f9" : "white",
                        padding: "15px",
                        borderRadius: "15px",
                        marginBottom: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        borderLeft: isPast
                          ? "4px solid #999"
                          : "4px solid #4CAF50",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            color: isPast ? "#666" : "#333",
                          }}
                        >
                          {b.name}{" "}
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "normal",
                              color: "#666",
                              background: isPast ? "#eee" : "#e8f5e9",
                              padding: "2px 6px",
                              borderRadius: "4px",
                            }}
                          >
                            {" "}
                            {b.guests}人
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#666",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            marginTop: "4px",
                          }}
                        >
                          <Phone size={12} /> {b.phone}
                        </div>
                        {b.note && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#888",
                              marginTop: "4px",
                              background: isPast ? "#eee" : "#fff3e0",
                              padding: "4px",
                              borderRadius: "4px",
                            }}
                          >
                            備註: {b.note}
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontWeight: "bold",
                            color: isPast ? "#999" : "#D32F2F",
                            fontSize: "16px",
                          }}
                        >
                          {b.time}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            );
          })
        )}
      </div>
    );
  };

  // 3. 統計數據
  const renderAdminStats = () => {
    const maxVal = Math.max(...calculateStats.map((s) => s.count), 1);
    return (
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <div style={styles.statCard}>
            <div
              style={{ fontSize: "12px", color: "#999", marginBottom: "5px" }}
            >
              總預約數 (本區間)
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}
            >
              {calculateStats.reduce((a, b) => a + b.count, 0)}
            </div>
          </div>
          <div style={styles.statCard}>
            <div
              style={{ fontSize: "12px", color: "#999", marginBottom: "5px" }}
            >
              平均人數/單
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#4CAF50" }}
            >
              {calculateStats.length > 0
                ? (
                    calculateStats.reduce((a, b) => a + b.count, 0) /
                    Math.max(
                      1,
                      calculateStats.filter((x) => x.count > 0).length
                    )
                  ).toFixed(1)
                : 0}
            </div>
          </div>
        </div>
        <div style={{ ...styles.card, margin: "0 0 20px 0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <BarChart3 size={18} /> 預約趨勢圖
            </h3>
            <select
              value={statsView}
              onChange={(e) => setStatsView(e.target.value)}
              style={{
                padding: "5px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "12px",
              }}
            >
              <option value="daily">近兩週 (每日)</option>
              <option value="monthly">近半年 (每月)</option>
            </select>
          </div>
          <div style={styles.chartBarContainer}>
            {calculateStats.map((item, idx) => {
              const heightPercent = (item.count / maxVal) * 100;
              return (
                <div key={idx} style={styles.chartBarWrapper}>
                  <div style={styles.chartValue}>
                    {item.count > 0 ? item.count : ""}
                  </div>
                  <div
                    style={{
                      ...styles.chartBar,
                      height: `${Math.max(heightPercent, 2)}%`,
                      opacity: item.count > 0 ? 1 : 0.3,
                    }}
                  ></div>
                  <div style={styles.chartLabel}>{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 4. 設定
  const renderAdminSettings = () => {
    const blockedDates = bookings.filter(
      (b) => b.name === BLOCK_NAME && b.date >= todayStr
    );
    return (
      <div style={{ padding: "20px" }}>
        <div
          style={{
            ...styles.card,
            margin: "0 0 20px 0",
            border: "2px solid #2196F3",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#1976D2",
            }}
          >
            <Settings size={18} /> 營業規則
          </h3>
          <div style={{ marginBottom: "15px" }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "5px",
                fontSize: "14px",
              }}
            >
              每週公休
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {["日", "一", "二", "三", "四", "五", "六"].map((day, idx) => (
                <label
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={globalSettings.weeklyClosed.includes(idx)}
                    onChange={() => {
                      const newClosed = globalSettings.weeklyClosed.includes(
                        idx
                      )
                        ? globalSettings.weeklyClosed.filter((d) => d !== idx)
                        : [...globalSettings.weeklyClosed, idx];
                      saveGlobalSettings({
                        ...globalSettings,
                        weeklyClosed: newClosed,
                      });
                    }}
                  />{" "}
                  {day}
                </label>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "14px" }}>
              週末 (六日) 開放預約?
            </div>
            <div
              style={{
                ...styles.toggleSwitch,
                ...(globalSettings.weekendOpen
                  ? styles.toggleSwitchActive
                  : {}),
              }}
              onClick={() =>
                saveGlobalSettings({
                  ...globalSettings,
                  weekendOpen: !globalSettings.weekendOpen,
                })
              }
            >
              <div
                style={{
                  ...styles.toggleKnob,
                  ...(globalSettings.weekendOpen
                    ? styles.toggleKnobActive
                    : {}),
                }}
              ></div>
            </div>
          </div>
        </div>

        <div
          style={{
            ...styles.card,
            margin: "0 0 20px 0",
            border: "2px solid #FF9800",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#E65100",
            }}
          >
            <Slash size={18} /> 臨時休園
          </h3>
          <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
            <input
              type="date"
              min={todayStr}
              style={{ ...styles.input, marginTop: 0 }}
              value={blockDate}
              onChange={(e) => setBlockDate(e.target.value)}
            />
            <select
              value={blockType}
              onChange={(e) => setBlockType(e.target.value)}
              style={{ ...styles.select, width: "auto", flexShrink: 0 }}
            >
              <option value="整日休園">整日</option>
              <option value="上午休園">上午</option>
              <option value="下午休園">下午</option>
            </select>
          </div>
          <button
            onClick={submitBlockDate}
            style={{
              ...styles.btnPrimary,
              width: "100%",
              padding: "10px",
              background: "#FF9800",
              fontSize: "14px",
            }}
          >
            新增休園
          </button>
          {blockedDates.length > 0 && (
            <div
              style={{ marginTop: "10px", fontSize: "12px", color: "#E65100" }}
            >
              <div style={{ fontWeight: "bold" }}>已設定休園 (未來)：</div>
              {blockedDates.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: "#FFF3E0",
                    padding: "4px 8px",
                    margin: "4px 0",
                    borderRadius: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    {b.date} {b.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            ...styles.card,
            margin: "0 0 20px 0",
            border: "2px solid #9C27B0",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#7B1FA2",
            }}
          >
            <Calendar size={18} /> 國定假日
          </h3>
          <div
            style={{
              display: "flex",
              gap: "5px",
              marginBottom: "10px",
              alignItems: "center",
            }}
          >
            <input
              type="date"
              style={{ ...styles.input, marginTop: 0 }}
              value={newHoliday.date}
              onChange={(e) =>
                setNewHoliday({ ...newHoliday, date: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="名稱"
              style={{ ...styles.input, marginTop: 0, width: "60px" }}
              value={newHoliday.name}
              onChange={(e) =>
                setNewHoliday({ ...newHoliday, name: e.target.value })
              }
            />
            <label
              style={{
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "2px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={newHoliday.open}
                onChange={(e) =>
                  setNewHoliday({ ...newHoliday, open: e.target.checked })
                }
              />{" "}
              開放
            </label>
            <button
              onClick={addHoliday}
              style={{
                ...styles.btnPrimary,
                width: "auto",
                padding: "8px",
                background: "#9C27B0",
              }}
            >
              <Plus size={16} />
            </button>
          </div>
          {holidays.length > 0 && (
            <div style={{ maxHeight: "150px", overflowY: "auto" }}>
              {holidays.map((h) => (
                <div
                  key={h.id}
                  style={{
                    background: "#F3E5F5",
                    padding: "5px 10px",
                    margin: "2px 0",
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "13px",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: "bold", marginRight: "5px" }}>
                      {h.date}
                    </span>
                    <span>{h.name}</span>
                  </div>
                  <span
                    style={{
                      color: h.open ? "green" : "red",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  >
                    {h.open ? "開放" : "休息"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ★ 後台-果況公告分頁
  const renderAdminStatus = () => {
    // 找出所有歷史公告 (修正：使用更安全的排序方法)
    const statusHistory = bookings
      .filter((b) => b.name === STATUS_NAME)
      .sort((a, b) => {
        const ca = a.createdAt || "";
        const cb = b.createdAt || "";
        return cb.localeCompare(ca);
      });

    return (
      <div style={{ padding: "20px" }}>
        <div
          style={{
            ...styles.card,
            margin: "0 0 20px 0",
            border: "2px solid #FF9800",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#E65100",
            }}
          >
            <Megaphone size={18} /> 發布新果況
          </h3>
          <textarea
            style={{ ...styles.textarea, minHeight: "100px" }}
            placeholder="請輸入最新的果況消息..."
            value={newStatusMsg}
            onChange={(e) => setNewStatusMsg(e.target.value)}
          />
          <button
            onClick={saveFruitStatus}
            style={{
              ...styles.btnPrimary,
              marginTop: "10px",
              background: "#FF9800",
            }}
          >
            立即發布
          </button>
        </div>

        <h3
          style={{ margin: "20px 0 10px 0", color: "#666", fontSize: "14px" }}
        >
          歷史公告紀錄
        </h3>
        {statusHistory.map((item) => (
          <div
            key={item.id}
            style={{
              background: "white",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "10px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              fontSize: "13px",
            }}
          >
            <div
              style={{ color: "#999", fontSize: "12px", marginBottom: "5px" }}
            >
              {item.createdAt
                ? new Date(item.createdAt).toLocaleString()
                : "無日期"}
            </div>
            <div style={{ color: "#333", lineHeight: "1.4" }}>{item.note}</div>
          </div>
        ))}
      </div>
    );
  };

  // --- 主後台視圖 ---
  const renderAdmin = () => {
    if (!isAuthenticated) {
      return (
        <div
          style={{
            ...styles.container,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={styles.overlay}></div>
          <div
            style={{
              ...styles.card,
              zIndex: 10,
              width: "80%",
              textAlign: "center",
            }}
          >
            <div
              style={{
                marginBottom: "20px",
                background: "#f5f5f5",
                width: 60,
                height: 60,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <Lock size={30} color="#555" />
            </div>
            <h2 style={{ marginBottom: "20px", color: "#333" }}>園主登入</h2>
            <input
              type="password"
              placeholder="輸入密碼"
              style={{
                ...styles.input,
                textAlign: "center",
                letterSpacing: "5px",
              }}
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
            <button
              onClick={handleAdminLogin}
              style={{ ...styles.btnPrimary, marginTop: "20px" }}
            >
              登入後台
            </button>
            <button
              onClick={() => setView("home")}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                border: "none",
                background: "none",
                color: "#999",
                cursor: "pointer",
              }}
            >
              回首頁
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          ...styles.container,
          background: "#f8f9fa",
          backgroundImage: "none",
        }}
      >
        <div style={styles.navBar}>
          <div
            style={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#333",
            }}
          >
            <List size={18} /> 管理後台
            {isLoadingData && <Loader2 className="animate-spin" size={14} />}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={fetchSheetData}
              style={{ border: "none", background: "none", cursor: "pointer" }}
              title="重新整理"
            >
              <RefreshCw size={20} color="#555" />
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setAdminPassword("");
                setView("home");
              }}
              style={{ border: "none", background: "none", cursor: "pointer" }}
              title="登出"
            >
              <LogOut size={20} color="#555" />
            </button>
          </div>
        </div>

        {/* ★ 分頁導航列 */}
        <div style={styles.tabBar}>
          <div
            style={{
              ...styles.tabItem,
              ...(adminTab === "bookings" ? styles.tabItemActive : {}),
            }}
            onClick={() => setAdminTab("bookings")}
          >
            預約清單
          </div>
          <div
            style={{
              ...styles.tabItem,
              ...(adminTab === "history" ? styles.tabItemActive : {}),
            }}
            onClick={() => setAdminTab("history")}
          >
            歷史紀錄
          </div>
          <div
            style={{
              ...styles.tabItem,
              ...(adminTab === "stats" ? styles.tabItemActive : {}),
            }}
            onClick={() => setAdminTab("stats")}
          >
            統計紀錄
          </div>
          <div
            style={{
              ...styles.tabItem,
              ...(adminTab === "status" ? styles.tabItemActive : {}),
            }}
            onClick={() => setAdminTab("status")}
          >
            果況公告
          </div>
          <div
            style={{
              ...styles.tabItem,
              ...(adminTab === "settings" ? styles.tabItemActive : {}),
            }}
            onClick={() => setAdminTab("settings")}
          >
            開放設定
          </div>
        </div>

        {/* ★ 內容切換 */}
        {adminTab === "bookings" && renderAdminBookings()}
        {adminTab === "history" && renderAdminHistory()}
        {adminTab === "stats" && renderAdminStats()}
        {adminTab === "status" && renderAdminStatus()}
        {adminTab === "settings" && renderAdminSettings()}
      </div>
    );
  };

  return (
    <div>
      {view === "home" && renderHome()}
      {view === "search" && renderSearch()}
      {view === "booking" && renderBooking()}
      {view === "success" && renderSuccess()}
      {view === "admin" && renderAdmin()}
    </div>
  );
}
