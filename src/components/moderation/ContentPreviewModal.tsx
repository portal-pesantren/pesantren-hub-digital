import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Image,
  Video,
  MessageCircle,
  Eye,
  Download,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  HardDrive,
  Shield,
  Brain
} from "lucide-react";
import { ModerationItemEnhanced, AIContentAnalysis } from "@/types/moderation";

interface ContentPreviewModalProps {
  item: ModerationItemEnhanced | null;
  aiAnalysis?: AIContentAnalysis;
  open: boolean;
  onClose: () => void;
  onApprove?: (id: number, notes?: string) => void;
  onReject?: (id: number, notes?: string) => void;
  onFlag?: (id: number, notes?: string) => void;
}

export const ContentPreviewModal = ({
  item,
  aiAnalysis,
  open,
  onClose,
  onApprove,
  onReject,
  onFlag,
}: ContentPreviewModalProps) => {
  const [reviewNotes, setReviewNotes] = useState("");
  const [activeTab, setActiveTab] = useState("content");

  if (!item) return null;

  const getContentIcon = (type: string) => {
    switch (type) {
      case "news":
      case "article":
        return <FileText className="w-6 h-6 text-blue-500" />;
      case "photo":
        return <Image className="w-6 h-6 text-green-500" />;
      case "video":
        return <Video className="w-6 h-6 text-red-500" />;
      case "comment":
        return <MessageCircle className="w-6 h-6 text-orange-500" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "waiting" as const, label: "Menunggu", icon: Clock },
      "in-progress": { variant: "in-progress" as const, label: "Diproses", icon: Eye },
      approved: { variant: "verified" as const, label: "Disetujui", icon: CheckCircle },
      rejected: { variant: "destructive" as const, label: "Ditolak", icon: AlertTriangle },
      flagged: { variant: "warning" as const, label: "Ditandai", icon: Shield },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: "secondary",
      medium: "info",
      high: "destructive",
      urgent: "destructive"
    } as const;

    const labels = {
      low: "Rendah",
      medium: "Sedang",
      high: "Tinggi",
      urgent: "Urgent"
    };

    return (
      <Badge variant={colors[priority as keyof typeof colors]}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  const getAiScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const handleAction = (action: "approve" | "reject" | "flag") => {
    switch (action) {
      case "approve":
        onApprove?.(item.id, reviewNotes);
        break;
      case "reject":
        onReject?.(item.id, reviewNotes);
        break;
      case "flag":
        onFlag?.(item.id, reviewNotes);
        break;
    }
    setReviewNotes("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getContentIcon(item.type)}
              <div>
                <DialogTitle className="text-xl font-bold">
                  {item.title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="gap-1">
                    <User className="w-3 h-3" />
                    {item.pondok}
                  </Badge>
                  {getStatusBadge(item.status)}
                  {getPriorityBadge(item.priority)}
                  {item.aiScore && (
                    <Badge variant="outline" className="gap-1">
                      <Brain className="w-3 h-3" />
                      <span className={getAiScoreColor(item.aiScore)}>
                        AI: {item.aiScore}/100
                      </span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Buka di Tab Baru
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Konten</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="content" className="h-full mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Content Preview */}
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Preview Konten
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-full">
                    <ScrollArea className="h-[400px]">
                      {item.type === "photo" && (
                        <div className="space-y-4">
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            <Image className="w-16 h-16 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Preview gambar akan ditampilkan di sini
                          </p>
                        </div>
                      )}
                      {item.type === "video" && (
                        <div className="space-y-4">
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            <Video className="w-16 h-16 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Preview video akan ditampilkan di sini
                          </p>
                        </div>
                      )}
                      {(item.type === "news" || item.type === "article" || item.type === "comment") && (
                        <div className="prose prose-sm max-w-none">
                          <div className="text-sm leading-relaxed whitespace-pre-wrap">
                            {item.fullContent || item.contentExcerpt || "Tidak ada konten untuk ditampilkan"}
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Content Information */}
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Informasi Konten
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Alasan Moderasi</h4>
                          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                            {item.reason}
                          </p>
                        </div>

                        {item.contentExcerpt && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">Kutipan Konten</h4>
                            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                              {item.contentExcerpt}
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-sm mb-1">ID Pondok</h4>
                            <p className="text-sm text-muted-foreground">#{item.pondokId}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-1">Versi</h4>
                            <p className="text-sm text-muted-foreground">v{item.version}</p>
                          </div>
                        </div>

                        {item.fileSize && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">Ukuran File</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <HardDrive className="w-4 h-4" />
                              {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        )}

                        {item.mimeType && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">Tipe MIME</h4>
                            <p className="text-sm text-muted-foreground">{item.mimeType}</p>
                          </div>
                        )}

                        <div>
                          <h4 className="font-medium text-sm mb-1">Tanggal Submit</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {item.submittedDate}
                          </p>
                        </div>

                        {item.lastModified && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">Terakhir Diubah</h4>
                            <p className="text-sm text-muted-foreground">{item.lastModified}</p>
                          </div>
                        )}

                        {item.flaggedKeywords && item.flaggedKeywords.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">Kata Kunci yang Ditandai</h4>
                            <div className="flex flex-wrap gap-1">
                              {item.flaggedKeywords.map((keyword, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="metadata" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Metadata Lengkap</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(item, null, 2)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-analysis" className="mt-4">
              <div className="space-y-6">
                {aiAnalysis && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="w-5 h-5" />
                          AI Safety Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className={`text-6xl font-bold ${getAiScoreColor(aiAnalysis.safetyScore)}`}>
                            {aiAnalysis.safetyScore}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            dari 100 (Semakin tinggi semakin aman)
                          </p>
                          <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  aiAnalysis.safetyScore >= 90 ? 'bg-green-500' :
                                  aiAnalysis.safetyScore >= 70 ? 'bg-yellow-500' :
                                  aiAnalysis.safetyScore >= 50 ? 'bg-orange-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${aiAnalysis.safetyScore}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Kategori Risiko</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(aiAnalysis.categories).map(([category, score]) => (
                            <div key={category} className="flex items-center justify-between">
                              <span className="text-sm capitalize">{category}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      score >= 70 ? 'bg-red-500' :
                                      score >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${score}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium w-8">{score}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {aiAnalysis.flaggedPhrases.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-red-600">Frasa yang Ditandai</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {aiAnalysis.flaggedPhrases.map((phrase, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {phrase}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {aiAnalysis.suggestions.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Saran AI</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {aiAnalysis.suggestions.map((suggestion, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

                {!aiAnalysis && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Analisis AI tidak tersedia untuk konten ini</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="review" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Review & Keputusan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Catatan Review
                    </label>
                    <Textarea
                      placeholder="Tambahkan catatan untuk keputusan Anda..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Status Saat Ini</h4>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(item.status)}
                      {item.moderatorName && (
                        <span className="text-sm text-muted-foreground">
                          oleh {item.moderatorName}
                        </span>
                      )}
                      {item.moderatedDate && (
                        <span className="text-sm text-muted-foreground">
                          pada {item.moderatedDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    {(item.status === "pending" || item.status === "flagged") && (
                      <>
                        <Button
                          onClick={() => handleAction("approve")}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Setujui
                        </Button>
                        <Button
                          onClick={() => handleAction("reject")}
                          variant="destructive"
                          className="flex-1"
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Tolak
                        </Button>
                        {item.status !== "flagged" && (
                          <Button
                            onClick={() => handleAction("flag")}
                            variant="outline"
                            className="flex-1"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Tandai
                          </Button>
                        )}
                      </>
                    )}
                    {item.status === "in-progress" && (
                      <>
                        <Button
                          onClick={() => handleAction("approve")}
                          className="flex-1"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Setujui
                        </Button>
                        <Button
                          onClick={() => handleAction("reject")}
                          variant="destructive"
                          className="flex-1"
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Tolak
                        </Button>
                      </>
                    )}
                    {item.status === "approved" && (
                      <Button
                        onClick={() => handleAction("flag")}
                        variant="outline"
                        className="flex-1"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Tandai Ulang
                      </Button>
                    )}
                    {(item.status === "rejected" || item.status === "flagged") && (
                      <Button
                        onClick={() => handleAction("approve")}
                        variant="outline"
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Review Ulang
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};