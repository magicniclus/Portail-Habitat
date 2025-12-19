"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Image as ImageIcon, Loader2, Upload } from "lucide-react";
import { uploadCoverPhoto, uploadLogoPhoto } from "@/lib/storage";

interface AdminArtisanMediaManagerProps {
  artisanId: string;
  logoUrl?: string;
  coverUrl?: string;
  disabled?: boolean;
  onUpdated?: () => void;
}

export default function AdminArtisanMediaManager({
  artisanId,
  logoUrl,
  coverUrl,
  disabled = false,
  onUpdated,
}: AdminArtisanMediaManagerProps) {
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canUploadLogo = useMemo(() => !!logoFile && !disabled && !isUploadingLogo, [logoFile, disabled, isUploadingLogo]);
  const canUploadCover = useMemo(() => !!coverFile && !disabled && !isUploadingCover, [coverFile, disabled, isUploadingCover]);

  const [logoLoaded, setLogoLoaded] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState(false);

  useEffect(() => {
    // Si pas d'URL, ne pas bloquer le skeleton
    if (!logoUrl) setLogoLoaded(true);
    else setLogoLoaded(false);
  }, [logoUrl]);

  useEffect(() => {
    // Si pas d'URL, ne pas bloquer le skeleton
    if (!coverUrl) setCoverLoaded(true);
    else setCoverLoaded(false);
  }, [coverUrl]);

  const resetLogoInput = () => {
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const resetCoverInput = () => {
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const openLogoPicker = () => {
    if (disabled || isUploadingLogo) return;
    logoInputRef.current?.click();
  };

  const openCoverPicker = () => {
    if (disabled || isUploadingCover) return;
    coverInputRef.current?.click();
  };

  const handleUploadLogo = async () => {
    if (!logoFile || disabled) return;
    setError(null);
    setSuccess(null);

    try {
      setIsUploadingLogo(true);
      await uploadLogoPhoto(artisanId, logoFile);
      setLogoFile(null);
      resetLogoInput();
      setSuccess("Logo mis à jour");
      onUpdated?.();
    } catch (e: any) {
      setError(e?.message || "Impossible d'uploader le logo");
      resetLogoInput();
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleUploadCover = async () => {
    if (!coverFile || disabled) return;
    setError(null);
    setSuccess(null);

    try {
      setIsUploadingCover(true);
      await uploadCoverPhoto(artisanId, coverFile);
      setCoverFile(null);
      resetCoverInput();
      setSuccess("Cover/Banner mis à jour");
      onUpdated?.();
    } catch (e: any) {
      setError(e?.message || "Impossible d'uploader la cover/banner");
      resetCoverInput();
    } finally {
      setIsUploadingCover(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Médias
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(error || success) && (
          <Alert variant={error ? "destructive" : "default"}>
            <AlertDescription>{error || success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="text-sm font-medium">Logo</div>

            <div className="flex items-start gap-4">
              <div className="relative w-24 h-24 flex-shrink-0">
                {!logoLoaded && <Skeleton className="w-24 h-24 rounded-md" />}
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Logo"
                    fill
                    className="object-cover rounded-md"
                    onLoad={() => setLogoLoaded(true)}
                    onError={() => setLogoLoaded(true)}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-md border flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <Input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={disabled || isUploadingLogo}
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button type="button" variant="outline" onClick={openLogoPicker} disabled={disabled || isUploadingLogo}>
                    Choisir un fichier
                  </Button>
                  <div className="h-10 px-3 rounded-md border flex items-center text-sm text-muted-foreground">
                    {logoFile?.name || "Aucun fichier sélectionné"}
                  </div>
                </div>

                <Button onClick={handleUploadLogo} disabled={!canUploadLogo} className="w-full">
                  {isUploadingLogo ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Upload...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Mettre à jour le logo
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium">Cover / Banner</div>

            <div className="space-y-3">
              <div className="relative w-full aspect-[16/6]">
                {!coverLoaded && <Skeleton className="w-full h-full rounded-md" />}
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt="Cover"
                    fill
                    className="object-cover rounded-md"
                    onLoad={() => setCoverLoaded(true)}
                    onError={() => setCoverLoaded(true)}
                  />
                ) : (
                  <div className="w-full h-full rounded-md border flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={disabled || isUploadingCover}
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                />
                <Button type="button" variant="outline" onClick={openCoverPicker} disabled={disabled || isUploadingCover}>
                  Choisir un fichier
                </Button>
                <Button onClick={handleUploadCover} disabled={!canUploadCover} className="w-full">
                  {isUploadingCover ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Upload...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Mettre à jour la cover
                    </>
                  )}
                </Button>
                <div className="md:col-span-2 h-10 px-3 rounded-md border flex items-center text-sm text-muted-foreground">
                  {coverFile?.name || "Aucun fichier sélectionné"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
