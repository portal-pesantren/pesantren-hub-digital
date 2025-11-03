import { ModerationItemEnhanced, AIContentAnalysis } from "@/types/moderation";

export interface ModerationResult {
  status: "Layak tayang" | "Perlu revisi" | "Ditolak";
  alasan: string;
  kategori: "Keagamaan" | "Pendidikan" | "Sosial" | "Humor" | "Politik" | "Lainnya";
  saran: string;
  aiScore: number; // 0-100
  kategoriRisiko: {
    ujaranKebencian: number; // 0-100
    pornografi: number; // 0-100
    penistaanAgama: number; // 0-100
    provokasi: number; // 0-100
    bahasaKasar: number; // 0-100
    hoaks: number; // 0-100
  };
}

export class ModerationService {
  private static instance: ModerationService;

  public static getInstance(): ModerationService {
    if (!ModerationService.instance) {
      ModerationService.instance = new ModerationService();
    }
    return ModerationService.instance;
  }

  /**
   * AI Content Analysis untuk moderasi konten pesantren
   */
  public async analisisKontenAI(content: string, contentType: string = "text"): Promise<ModerationResult> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Normalize content untuk analisis
    const normalizedContent = this.normalizeContent(content);

    // Analisis kategori konten
    const kategori = this.kategorikanKonten(normalizedContent);

    // Analisis risiko
    const kategoriRisiko = this.analisisRisiko(normalizedContent);

    // Generate AI Score
    const aiScore = this.hitungAIScore(kategoriRisiko);

    // Tentukan status dan alasan
    const { status, alasan, saran } = this.tentukanStatus(normalizedContent, kategoriRisiko, kategori);

    return {
      status,
      alasan,
      kategori,
      saran,
      aiScore,
      kategoriRisiko
    };
  }

  /**
   * Format AI Analysis untuk UI
   */
  public createAIAnalysis(moderationResult: ModerationResult, itemId: number): AIContentAnalysis {
    const categories = {
      spam: moderationResult.kategoriRisiko.hoaks,
      violence: moderationResult.kategoriRisiko.provokasi,
      adult: moderationResult.kategoriRisiko.pornografi,
      hate: moderationResult.kategoriRisiko.ujaranKebencian,
      misinformation: moderationResult.kategoriRisiko.hoaks,
      copyright: 10 // Default untuk content copyright
    };

    return {
      id: Date.now(),
      itemId,
      timestamp: new Date().toISOString(),
      safetyScore: moderationResult.aiScore,
      categories,
      flaggedPhrases: this.extractFlaggedPhrases(moderationResult.alasan),
      suggestions: [moderationResult.saran],
      confidence: this.calculateConfidence(categories)
    };
  }

  private normalizeContent(content: string): string {
    return content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private kategorikanKonten(content: string): ModerationResult["kategori"] {
    const religiousKeywords = ['islam', 'allah', 'rasul', 'alquran', 'hadist', 'salat', 'puasa', 'haji', 'zakat', 'iman', 'taqwa', 'pondok', 'pesantren', 'santri', 'ustadz', 'kyai', 'dakwah', 'tauhid', 'syariah', 'fiqh'];
    const educationKeywords = ['belajar', 'pendidikan', 'mengajar', 'sekolah', 'kuliah', 'ilmu', 'pengetahuan', 'buku', 'tutorial', 'tips', 'panduan'];
    const socialKeywords = ['masyarakat', 'komunitas', 'keluarga', 'teman', 'interaksi', 'bantu', 'kerja', 'sosial', 'gotong', 'royong'];
    const humorKeywords = ['lucu', 'guyon', 'canda', 'lelucon', 'ketawa', 'hiburan', 'seru'];
    const politicsKeywords = ['politik', 'pemerintah', 'pemilu', 'presiden', 'menteri', 'kebijakan', 'hukum', 'negara'];

    const contentLower = content.toLowerCase();

    if (religiousKeywords.some(keyword => contentLower.includes(keyword))) {
      return "Keagamaan";
    }
    if (educationKeywords.some(keyword => contentLower.includes(keyword))) {
      return "Pendidikan";
    }
    if (socialKeywords.some(keyword => contentLower.includes(keyword))) {
      return "Sosial";
    }
    if (humorKeywords.some(keyword => contentLower.includes(keyword))) {
      return "Humor";
    }
    if (politicsKeywords.some(keyword => contentLower.includes(keyword))) {
      return "Politik";
    }

    return "Lainnya";
  }

  private analisisRisiko(content: string): ModerationResult["kategoriRisiko"] {
    // Daftar kata yang berisiko untuk konteks pesantren
    const hateWords = ['benci', 'musuh', 'kafir', 'munafik', 'tidak suka', 'jelek', 'buruk', 'hina'];
    const adultWords = ['porno', 'sex', 'panas', 'telanjang', 'vulgar', 'mesum', 'cabul'];
    const blasphemyWords = ['gila tuhan', 'menghina agama', 'penistaan', 'menyalahkan tuhan'];
    const provocationWords = ['ribut', 'konflik', 'perang', 'serang', 'hancurkan', 'lawan'];
    const profanityWords = ['anjing', 'babi', 'bangsat', 'setan', 'iblis', 'tolol', 'goblok'];
    const hoaxWords = ['berita bohong', 'hoax', 'fitnah', 'palsu', 'rekayasa', 'tidak benar'];

    const contentLower = content.toLowerCase();
    const words = contentLower.split(/\s+/);

    return {
      ujaranKebencian: this.calculateRiskScore(words, hateWords),
      pornografi: this.calculateRiskScore(words, adultWords),
      penistaanAgama: this.calculateRiskScore(words, blasphemyWords),
      provokasi: this.calculateRiskScore(words, provocationWords),
      bahasaKasar: this.calculateRiskScore(words, profanityWords),
      hoaks: this.calculateRiskScore(words, hoaxWords)
    };
  }

  private calculateRiskScore(words: string[], riskWords: string[]): number {
    const foundWords = words.filter(word => riskWords.some(riskWord => word.includes(riskWord)));
    return Math.min(100, (foundWords.length / Math.max(1, words.length)) * 100);
  }

  private hitungAIScore(risiko: ModerationResult["kategoriRisiko"]): number {
    const weights = {
      ujaranKebencian: 0.3,
      pornografi: 0.3,
      penistaanAgama: 0.25,
      provokasi: 0.1,
      bahasaKasar: 0.05,
      hoaks: 0.1
    };

    const totalRisk = Object.entries(risiko).reduce((total, [key, value]) => {
      return total + (value * weights[key as keyof typeof weights]);
    }, 0);

    return Math.max(0, 100 - totalRisk);
  }

  private tentukanStatus(
    content: string,
    risiko: ModerationResult["kategoriRisiko"],
    kategori: ModerationResult["kategori"]
  ): Pick<ModerationResult, "status" | "alasan" | "saran"> {
    const maxRisk = Math.max(...Object.values(risiko));

    // Status DITOLAK - Risiko tinggi
    if (maxRisk >= 70) {
      const highRiskCategories = Object.entries(risiko)
        .filter(([_, value]) => value >= 70)
        .map(([key, _]) => {
          const categoryNames = {
            ujaranKebencian: "Ujaran kebencian",
            pornografi: "Konten dewasa",
            penistaanAgama: "Penistaan agama",
            provokasi: "Provokasi",
            bahasaKasar: "Bahasa kasar",
            hoaks: "Hoaks/fake news"
          };
          return categoryNames[key as keyof typeof categoryNames];
        });

      return {
        status: "Ditolak",
        alasan: `Konten mengandung ${highRiskCategories.join(", ")} yang tidak sesuai dengan nilai-nilai Islam dan etika pesantren.`,
        saran: "Harap membuat konten yang mendidik, positif, dan sesuai dengan nilai-nilai Islam. Hindari bahasa kasar, provokasi, atau konten yang meresahkan."
      };
    }

    // Status PERLU REVISI - Risiko sedang
    if (maxRisk >= 30) {
      const mediumRiskCategories = Object.entries(risiko)
        .filter(([_, value]) => value >= 30)
        .map(([key, _]) => {
          const categoryNames = {
            ujaranKebencian: "potensi ujaran kebencian",
            pornografi: "konten terlalu personal",
            penistaanAgama: "potensi penistaan agama",
            provokasi: "potensi provokasi",
            bahasaKasar: "bahasa yang kurang sopan",
            hoaks: "informasi yang perlu diverifikasi"
          };
          return categoryNames[key as keyof typeof categoryNames];
        });

      return {
        status: "Perlu revisi",
        alasan: `Konten mengandung ${mediumRiskCategories.join(", ")} yang perlu perbaikan.`,
        saran: "Silakan perbaiki bahasa yang kurang sopan, tambahkan referensi yang valid, dan pastikan konten mendidik serta sesuai dengan adab Islam."
      };
    }

    // Status LAYAK TAYANG - Risiko rendah
    if (maxRisk < 30) {
      // Check apakah konten sesuai dengan kategori
      const isContentAppropriate = this.validateContentForCategory(content, kategori);

      if (!isContentAppropriate) {
        return {
          status: "Perlu revisi",
          alasan: "Konten tidak sesuai dengan kategori yang dipilih atau memerlukan klarifikasi lebih lanjut.",
          saran: "Pastikan konten sesuai dengan kategori yang dipilih dan tambahkan informasi yang lebih jelas. Untuk konten keagamaan, sertakan dalil atau referensi yang valid."
        };
      }

      return {
        status: "Layak tayang",
        alasan: "Konten aman, mendidik, dan sesuai dengan nilai-nilai Islam serta etika pesantren.",
        saran: "Konten baik! Pertahankan kualitas dan terus buat konten yang bermanfaat bagi masyarakat."
      };
    }

    // Default fallback
    return {
      status: "Perlu revisi",
      alasan: "Konten memerlukan review lebih lanjut.",
      saran: "Harap klarifikasi maksud dan tujuan konten yang disampaikan."
    };
  }

  private validateContentForCategory(content: string, kategori: ModerationResult["kategori"]): boolean {
    // Validasi spesifik per kategori
    switch (kategori) {
      case "Keagamaan":
        const hasIslamicContent = ['islam', 'allah', 'rasul', 'alquran', 'hadist', 'iman', 'islam', 'muslim']
          .some(keyword => content.toLowerCase().includes(keyword));
        return hasIslamicContent || content.length > 100; // Allow long content without specific keywords

      case "Pendidikan":
        return content.length > 50; // Educational content should be substantial

      case "Humor":
        // Humor should be positive and not offensive
        const hasNegativeWords = ['benci', 'jelek', 'hina', 'ejek'].some(word =>
          content.toLowerCase().includes(word));
        return !hasNegativeWords;

      default:
        return content.length > 20; // Basic length validation
    }
  }

  private extractFlaggedPhrases(reason: string): string[] {
    // Extract key phrases from reason for highlighting
    const phrases = reason.split(/[,.!]+/).filter(phrase => phrase.trim().length > 0);
    return phrases.slice(0, 3); // Return up to 3 phrases
  }

  private calculateConfidence(categories: AIContentAnalysis["categories"]): number {
    // Calculate confidence based on how clean the content is
    const totalRisk = Object.values(categories).reduce((sum, risk) => sum + risk, 0);
    const maxPossibleRisk = Object.keys(categories).length * 100;

    return Math.round(((maxPossibleRisk - totalRisk) / maxPossibleRisk) * 100);
  }

  /**
   * Batch analysis untuk multiple content items
   */
  public async analisisBatch(contents: Array<{ id: number; content: string; type: string }>): Promise<Map<number, ModerationResult>> {
    const results = new Map<number, ModerationResult>();

    for (const item of contents) {
      try {
        const result = await this.analisisKontenAI(item.content, item.type);
        results.set(item.id, result);
      } catch (error) {
        console.error(`Error analyzing content ${item.id}:`, error);
        // Set default safe result
        results.set(item.id, {
          status: "Perlu revisi",
          alasan: "Terjadi kesalahan dalam analisis AI. Harap review manual.",
          kategori: "Lainnya",
          saran: "Periksa konten secara manual dan pastikan tidak ada pelanggaran.",
          aiScore: 50,
          kategoriRisiko: {
            ujaranKebencian: 0,
            pornografi: 0,
            penistaanAgama: 0,
            provokasi: 0,
            bahasaKasar: 0,
            hoaks: 0
          }
        });
      }
    }

    return results;
  }

  /**
   * Update content status berdasarkan hasil AI analysis
   */
  public updateItemWithAIAnalysis(
    item: ModerationItemEnhanced,
    aiResult: ModerationResult
  ): ModerationItemEnhanced {
    return {
      ...item,
      aiScore: aiResult.aiScore,
      flaggedKeywords: this.extractFlaggedPhrases(aiResult.alasan),
      lastModified: new Date().toISOString(),
      version: item.version + 1,
      metadata: {
        ...item.metadata,
        aiAnalysis: aiResult,
        aiAnalysisDate: new Date().toISOString(),
        category: aiResult.kategori
      }
    };
  }
}