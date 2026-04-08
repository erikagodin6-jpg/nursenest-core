/**
 * Vietnamese hand patches for high-traffic keys
 * (Study Next, nav, auth, CTAs, footer).
 * Run after merge/Lingva: node script/apply-vi-priority-patches.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const PATCHES = {
  // Study Next
  "studyNext.title": "Học tiếp",
  "studyNext.primary": "Bước tiếp theo được đề xuất",
  "studyNext.secondary": "Các hành động hữu ích khác",
  "studyNext.confidence.high": "Độ tin cậy cao",
  "studyNext.confidence.medium": "Độ tin cậy trung bình",
  "studyNext.confidence.low": "Bằng chứng hạn chế",
  "studyNext.cta.continue": "Tiếp tục",
  "studyNext.cta.practiceNow": "Luyện tập ngay",
  "studyNext.cta.reviewNow": "Ôn tập ngay",
  "studyNext.linkStudyPlan": "Kế hoạch học",
  "studyNext.openCta": "Mở",
  "studyNext.reasons.continue_path_started": "Bạn đã bắt đầu lộ trình này",
  "studyNext.reasons.pathway_progress_stalled":
    "Tiến độ lộ trình của bạn đang chậm lại",
  "studyNext.reasons.weak_topic_high_confidence":
    "Điểm yếu ở chủ đề này được dữ liệu hỗ trợ rõ ràng",
  "studyNext.reasons.weak_topic_recent_miss":
    "Sai sót gần đây ở chủ đề này",
  "studyNext.reasons.weak_topic_low_confidence":
    "Độ tin cậy thấp ở chủ đề này",
  "studyNext.reasons.practice_retest_weak_pool":
    "Ôn lại bộ câu hỏi phần yếu của bạn",
  "studyNext.reasons.insufficient_signals_mixed_bank":
    "Bắt đầu bằng bài luyện hỗn hợp",
  // Conversion preview
  "conversion.lockedStudyNext.ariaLabel":
    "Xem trước Study Next dành cho người đăng ký (dữ liệu mẫu, đã khóa)",
  "conversion.lockedStudyNext.previewHint":
    "Bố cục minh họa — sau khi đăng ký, gợi ý sẽ cá nhân hóa theo bài luyện của bạn.",
  // Navigation
  "components.navigation.closeMenu": "Đóng menu",
  "components.navigation.freeTools": "Công cụ miễn phí",
  "components.navigation.internationalNurses": "Điều dưỡng quốc tế",
  "components.navigation.npExamPreparation": "Ôn thi NP",
  "components.navigation.openMenu": "Mở menu",
  "components.navigation.siConventionalConverter":
    "Bộ chuyển đổi SI ↔ đơn vị thông dụng",
  // Auth
  "auth.forgotPassword": "Quên mật khẩu",
  "auth.login": "Đăng nhập",
  "auth.resetPassword": "Đặt lại mật khẩu",
  "auth.signup": "Tạo tài khoản",
  // CTAs
  "cta.continuePlan": "Tiếp tục kế hoạch",
  "cta.improveWeakAreas": "Cải thiện phần yếu",
  "cta.seePlansPricing": "Xem gói và giá",
  "cta.unlockPlan": "Mở khóa kế hoạch học cá nhân",
  // Footer
  "footer.about": "Giới thiệu NurseNest",
  "footer.acceptableUse": "Sử dụng hợp lệ",
  "footer.allSpecialties": "Tất cả chuyên ngành",
  "footer.alliedHealth": "Khoa học hỗ trợ y tế",
  "footer.alliedHealthExamPrep": "Ôn thi khoa học hỗ trợ y tế",
  "footer.alliedHealthGuides": "Hướng dẫn khoa học hỗ trợ y tế",
  "footer.anatomyExplorer": "Khám phá giải phẫu",
  "footer.applyNest": "Công cụ nghề nghiệp ApplyNest",
  "footer.blog": "Blog",
  "footer.caseSimulations": "Mô phỏng ca lâm sàng",
  "footer.caseStudies": "Ca lâm sàng",
  "footer.clinicalClarity": "Làm rõ lâm sàng",
  "footer.clinicalLessons": "Bài lâm sàng",
  "footer.clinicalTools": "Công cụ lâm sàng",
  "footer.contact": "Liên hệ",
  "footer.disclaimer": "Tuyên bố miễn trừ",
  "footer.ecosystem": "Hệ sinh thái",
  "footer.ecosystemCareers": "Nghề nghiệp y tế",
  "footer.ecosystemExamPrep": "Ôn thi",
  "footer.ecosystemNewGrad": "Hỗ trợ tân tốt nghiệp",
  "footer.educationEcosystem": "Hệ sinh thái giáo dục",
  "footer.emailBannerPhase2":
    "Đăng ký nhận bản tin sẽ kết nối API đăng ký ở giai đoạn 2.",
  "footer.emailBannerSubtitle":
    "Chọn tần suất nhận tin. Hủy đăng ký bất cứ lúc nào.",
  "footer.emailBannerTitle":
    "Nhận câu hỏi hữu ích lâm sàng qua email",
  "footer.examPrep": "Ôn thi",
  "footer.faq": "FAQ",
  "footer.feedback": "Phản hồi",
  "footer.forSchools": "Dành cho trường học",
  "footer.healthcareJobs": "Việc làm y tế",
  "footer.icuGuide": "Hướng dẫn ICU",
  "footer.imagingGuide": "Hướng dẫn chẩn đoán hình ảnh",
  "footer.labValues": "Chỉ số xét nghiệm",
  "footer.legal": "Pháp lý",
  "footer.legalDisclaimer":
    "NurseNest cung cấp nội dung giáo dục để ôn thi và không liên kết với NCLEX, cơ quan quản lý hoặc cơ quan cấp phép.",
  "footer.medLabTech": "Kỹ thuật xét nghiệm",
  "footer.medMath": "Tính liều thuốc",
  "footer.medSurgGuide": "Hướng dẫn điều dưỡng nội ngoại khoa",
  "footer.medicationMastery": "Thành thạo dùng thuốc",
  "footer.mentalHealthGuide": "Hướng dẫn điều dưỡng sức khỏe tâm thần",
  "footer.mltGuide": "Hướng dẫn MLT",
  "footer.mockExams": "Thi thử",
  "footer.nephroGuide": "Hướng dẫn điều dưỡng thận",
  "footer.newGradHub": "Trung tâm tân tốt nghiệp",
  "footer.newGradSupportSection": "Hỗ trợ tân tốt nghiệp",
  "footer.nicuGuide": "Hướng dẫn NICU",
  "footer.nursing": "Điều dưỡng",
  "footer.nursingSpecialties": "Chuyên ngành điều dưỡng",
  "footer.orthoGuide": "Hướng dẫn điều dưỡng chỉnh hình",
  "footer.otGuide": "Hướng dẫn trị liệu nghề nghiệp",
  "footer.palliativeGuide": "Hướng dẫn chăm sóc giảm nhẹ",
  "footer.paramedic": "Nhân viên cấp cứu (paramedic)",
  "footer.paramedicGuide": "Hướng dẫn paramedic",
  "footer.preNursing": "Tiền điều dưỡng",
  "footer.pricing": "Giá",
  "footer.privacy": "Quyền riêng tư",
  "footer.ptGuide": "Hướng dẫn vật lý trị liệu",
  "footer.questionOfTheDay": "Câu hỏi trong ngày",
  "footer.refundPolicy": "Chính sách hoàn tiền",
  "footer.resources": "Tài nguyên",
  "footer.respiratoryTherapy": "Trị liệu hô hấp",
  "footer.rights": "Bảo lưu mọi quyền.",
  "footer.rrtGuide": "Hướng dẫn hô hấp",
  "footer.studyInYourLanguage": "Học điều dưỡng bằng ngôn ngữ của bạn",
  "footer.studyTools": "Công cụ học",
  "footer.terms": "Điều khoản",
  "footer.testBank": "Ngân hàng câu hỏi",
  "footer.toolsHub": "Trung tâm công cụ",
  "footer.traumaGuide": "Hướng dẫn điều dưỡng chấn thương",
  "footer.videoLectures": "Video bài giảng",
  "footer.viewAllLanguages": "Xem tất cả ngôn ngữ →",
};

const viPath = path.join(root, "nursenest-core/public/i18n/vi.json");
const clientPath = path.join(root, "client/public/i18n/vi.json");

const vi = JSON.parse(readFileSync(viPath, "utf8"));
for (const [k, v] of Object.entries(PATCHES)) {
  if (!(k in vi)) console.warn("missing key in vi.json:", k);
  vi[k] = v;
}
const json = JSON.stringify(vi);
writeFileSync(viPath, json);
writeFileSync(clientPath, json);
console.log(`Patched ${Object.keys(PATCHES).length} Vietnamese strings`);
