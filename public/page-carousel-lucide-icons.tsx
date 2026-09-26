"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { CalendarDays, Clock3, House, Mail } from "lucide-react";

type RsvpStatus = "Hadir" | "Tidak Hadir" | "Belum Konfirmasi";

interface RsvpItem {
  id: string;
  name: string;
  message: string;
  status: RsvpStatus;
  createdAt: string;
}

const galleryImages = [
  "/potret-1.jpg",
  "/potret-2.jpg",
  "/potret-3.jpg",
  "/potret-4.jpg",
  "/potret-5.jpg",
  "/potret-6.jpg",
];

export default function InvitationPage() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [guestName, setGuestName] = useState("Tamu");
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  /* =========================
     RSVP
  ========================== */

  const [rsvpName, setRsvpName] = useState("");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [rsvpStatus, setRsvpStatus] =
    useState<RsvpStatus>("Hadir");

  const [rsvpList, setRsvpList] = useState<RsvpItem[]>([]);
  const [showAllRsvp, setShowAllRsvp] = useState(false);
  const [sendingRsvp, setSendingRsvp] = useState(false);
  const [rsvpInfo, setRsvpInfo] = useState("");

  /* =========================
     CAROUSEL FOTO
  ========================== */

  const [activePhoto, setActivePhoto] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /* =========================
     NAMA TAMU DARI URL
  ========================== */

  useEffect(() => {
    if (!pathname) {
      setGuestName("Tamu");
      return;
    }

    const pathParts = pathname.split("/").filter(Boolean);
    const guestSlug = pathParts[pathParts.length - 1];

    if (!guestSlug) {
      setGuestName("Tamu");
      return;
    }

    let decodedGuest = guestSlug;

    try {
      decodedGuest = decodeURIComponent(guestSlug);
    } catch {
      decodedGuest = guestSlug;
    }

    const formattedGuest = decodedGuest
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const capitalizedGuest = formattedGuest
      .split(" ")
      .map((word) =>
        word
          ? word.charAt(0).toUpperCase() + word.slice(1)
          : word
      )
      .join(" ");

    const finalGuestName = capitalizedGuest || "Tamu";

    setGuestName(finalGuestName);
    setRsvpName(finalGuestName);
  }, [pathname]);

  /* =========================
     COUNTDOWN
  ========================== */

  useEffect(() => {
    const targetDate = new Date(
      "2026-10-01T15:00:00+08:00"
    ).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const distance = targetDate - now;

      if (distance <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      setCountdown({
        days: Math.floor(
          distance / (1000 * 60 * 60 * 24)
        ),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        ),
        minutes: Math.floor(
          (distance % (1000 * 60 * 60)) /
            (1000 * 60)
        ),
        seconds: Math.floor(
          (distance % (1000 * 60)) / 1000
        ),
      });
    };

    updateCountdown();

    const timer = window.setInterval(
      updateCountdown,
      1000
    );

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const formatNumber = (value: number) => {
    return String(value).padStart(2, "0");
  };

  /* =========================
     OPEN INVITATION
  ========================== */

  const openInvitation = async () => {
    if (opening || opened) return;

    setOpening(true);

    if (audioRef.current) {
      try {
        audioRef.current.volume = 0.5;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log(
          "Audio tidak dapat diputar:",
          error
        );
      }
    }

    window.setTimeout(() => {
      setOpened(true);

      window.setTimeout(() => {
        document
          .getElementById("invitation")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 150);
    }, 1500);
  };

  /* =========================
     MUSIC
  ========================== */

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  /* =========================
     AMBIL DATA RSVP
  ========================== */

  const loadRsvp = async () => {
    try {
      const response = await fetch("/api/rsvp", {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = await response.json();

      if (Array.isArray(data)) {
        setRsvpList(data);
      }
    } catch (error) {
      console.log("Gagal mengambil RSVP:", error);
    }
  };

  useEffect(() => {
    loadRsvp();
  }, []);

  /* =========================
     KIRIM RSVP
  ========================== */

  const handleSubmitRsvp = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!rsvpName.trim()) {
      setRsvpInfo("Nama wajib diisi.");
      return;
    }

    if (!rsvpMessage.trim()) {
      setRsvpInfo("Ucapan wajib diisi.");
      return;
    }

    setSendingRsvp(true);
    setRsvpInfo("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: rsvpName.trim(),
          message: rsvpMessage.trim(),
          status: rsvpStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setRsvpInfo(
          result.message || "Gagal mengirim RSVP."
        );
        return;
      }

      setRsvpMessage("");
      setRsvpStatus("Hadir");
      setRsvpInfo(
        "Terima kasih, konfirmasi dan ucapan telah dikirim."
      );

      await loadRsvp();
    } catch (error) {
      console.log(error);

      setRsvpInfo(
        "Terjadi kesalahan saat mengirim RSVP."
      );
    } finally {
      setSendingRsvp(false);
    }
  };

  const visibleRsvp = showAllRsvp
    ? rsvpList
    : rsvpList.slice(0, 5);

  const formatRsvpDate = (date: string) => {
    const value = new Date(date);

    return value.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================
     AUTO CAROUSEL FOTO
  ========================== */

  useEffect(() => {
    if (!opened) return;

    const galleryTimer = window.setInterval(() => {
      setActivePhoto((previous) =>
        previous === galleryImages.length - 1
          ? 0
          : previous + 1
      );
    }, 4000);

    return () => {
      window.clearInterval(galleryTimer);
    };
  }, [opened]);

  useEffect(() => {
    const container = thumbnailContainerRef.current;
    const activeThumbnail = thumbnailRefs.current[activePhoto];

    if (!container || !activeThumbnail) return;

    const targetLeft =
      activeThumbnail.offsetLeft -
      container.clientWidth / 2 +
      activeThumbnail.clientWidth / 2;

    container.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
  }, [activePhoto]);

  const showPreviousPhoto = () => {
    setActivePhoto((previous) =>
      previous === 0
        ? galleryImages.length - 1
        : previous - 1
    );
  };

  const showNextPhoto = () => {
    setActivePhoto((previous) =>
      previous === galleryImages.length - 1
        ? 0
        : previous + 1
    );
  };

  return (
    <main className="min-h-screen w-full bg-[#151515] text-white">
      <audio
        ref={audioRef}
        src="/gus-teja-2.mp3"
        loop
        preload="auto"
      />

      {/* =========================
          MUSIC BUTTON
      ========================== */}

      {opening && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label="Kontrol musik"
          className="
            fixed bottom-5 right-5 z-[999]
            flex h-11 w-11 items-center justify-center
            rounded-full border border-[#e1b954]
            bg-black/75 text-[#e1b954]
            shadow-lg backdrop-blur-md
          "
        >
          <span
            className={`
              flex h-8 w-8 items-center justify-center
              rounded-full border border-[#e1b954]
              ${
                isPlaying
                  ? "[animation:music-spin_4s_linear_infinite]"
                  : ""
              }
            `}
          >
            ♪
          </span>
        </button>
      )}

      {/* =====================================================
          PAGE 1 - COVER
      ====================================================== */}

      <section
        className="
          relative mx-auto
          h-[100svh] min-h-[680px]
          w-full max-w-[460px]
          overflow-hidden bg-black
        "
      >
        <div
          className={`
            absolute inset-0 z-0
            bg-[url('/center1.jpg')]
            bg-cover bg-center bg-no-repeat
            transition-transform duration-[1800ms]
            [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]
            ${
              opening
                ? "scale-[1.075]"
                : "scale-[1.015]"
            }
          `}
        />

        <div
          className={`
            absolute inset-0 z-[1]
            transition-all duration-[1200ms]
            ${
              opening
                ? "bg-[linear-gradient(to_bottom,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.55)_25%,rgba(0,0,0,0.48)_50%,rgba(0,0,0,0.68)_100%)]"
                : "bg-[linear-gradient(to_bottom,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.48)_25%,rgba(0,0,0,0.42)_50%,rgba(0,0,0,0.55)_75%,rgba(0,0,0,0.72)_100%)]"
            }
          `}
        />

        <Image
          src="/ornament-top-left.png"
          alt=""
          width={180}
          height={180}
          priority
          className={`
            pointer-events-none
            absolute left-3 top-3 z-[5]
            h-auto w-[112px] object-contain
            transition-all duration-700
            ${
              opening
                ? "scale-110 opacity-0 blur-sm"
                : "scale-100 opacity-100"
            }
          `}
        />

        <Image
          src="/ornament-top-right.png"
          alt=""
          width={180}
          height={180}
          priority
          className={`
            pointer-events-none
            absolute right-3 top-3 z-[5]
            h-auto w-[112px] object-contain
            transition-all duration-700
            ${
              opening
                ? "scale-110 opacity-0 blur-sm"
                : "scale-100 opacity-100"
            }
          `}
        />

        <Image
          src="/ornament-bottom-left.png"
          alt=""
          width={180}
          height={180}
          priority
          className={`
            pointer-events-none
            absolute bottom-1.5 left-1.5 z-[5]
            h-auto w-[112px] object-contain
            transition-all duration-700
            ${
              opening
                ? "scale-110 opacity-0 blur-sm"
                : "scale-100 opacity-100"
            }
          `}
        />

        <Image
          src="/ornament-bottom-right.png"
          alt=""
          width={180}
          height={180}
          priority
          className={`
            pointer-events-none
            absolute bottom-1.5 right-1.5 z-[5]
            h-auto w-[112px] object-contain
            transition-all duration-700
            ${
              opening
                ? "scale-110 opacity-0 blur-sm"
                : "scale-100 opacity-100"
            }
          `}
        />

        <div
          className="
            relative z-[4]
            flex h-full w-full flex-col
            items-center
            px-6 pb-10 pt-24
            text-center
          "
        >
          <div
            className={`
              flex w-full flex-1
              flex-col items-center justify-center
              transition-transform duration-[1300ms]
              [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]
              ${
                opening
                  ? "translate-y-0"
                  : "-translate-y-5"
              }
            `}
          >
            <div
              className={`
                mb-3
                flex min-h-[72px] w-[145px]
                items-center justify-center
                transition-all duration-[1300ms]
                ${
                  opening
                    ? "scale-110 drop-shadow-[0_0_12px_rgba(225,185,84,0.25)]"
                    : "scale-100"
                }
              `}
            >
              <Image
                src="/logo.png"
                alt="Ornamen"
                width={180}
                height={120}
                priority
                className="h-auto w-full object-contain"
              />
            </div>

            <div className="flex w-full items-center justify-center gap-3">
              <span className="h-px max-w-[100px] flex-1 bg-white/70" />

              <p className="text-[13px] font-medium tracking-wide">
                UNDANGAN
              </p>

              <span className="h-px max-w-[100px] flex-1 bg-white/70" />
            </div>

            <h1
              className="
                mt-2
                font-[family-name:var(--font-allura)]
                text-[68px] font-normal leading-none
                text-white
                drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)]
              "
            >
              Metatah
            </h1>

            <p className="mt-2 text-sm font-semibold tracking-[0.12em]">
              01.10.2026
            </p>
          </div>

          <div
            className={`
              w-full shrink-0
              transition-all duration-700
              ${
                opening
                  ? "pointer-events-none translate-y-8 opacity-0 blur-sm"
                  : "translate-y-0 opacity-100"
              }
            `}
          >
            <p className="mb-3 text-sm font-semibold">
              kpd. Bpk/Ibu/Saudara/i
            </p>

            <div
              className="
                flex min-h-[48px] w-full
                items-center justify-center
                rounded-md
                border border-white/80
                bg-black/25
                px-4 py-3
                text-[15px] font-medium
                backdrop-blur-sm
              "
            >
              {guestName}
            </div>

            <button
              type="button"
              onClick={openInvitation}
              disabled={opening}
              className="
                mt-8 min-w-[140px]
                rounded-lg
                border-2 border-[#8f742e]
                bg-[#e1b954]
                px-5 py-3
                text-[13px] font-semibold
                text-[#3d3008]
                outline outline-2 outline-white/90
                shadow-[0_4px_16px_rgba(0,0,0,0.35)]
                transition-all duration-300
                hover:-translate-y-0.5
                hover:bg-[#edc967]
                active:scale-[0.97]
                disabled:cursor-default
              "
            >
              Buka Undangan
            </button>
          </div>
        </div>
      </section>

      {opened && (
        <>
          {/* =================================================
              PAGE 2 - PEMBUKAAN
          ================================================== */}

          <section
            id="invitation"
            className="
              relative mx-auto
              h-[100svh] min-h-[760px]
              w-full max-w-[460px]
              overflow-hidden bg-black
              [animation:invitation-reveal_850ms_ease_both]
            "
          >
            <div
              className="
                pointer-events-none
                absolute inset-0 z-[1]
                bg-[url('/background.png')]
                bg-repeat opacity-[0.10]
              "
              style={{
                backgroundSize: "230px auto",
                backgroundPosition: "center top",
              }}
            />

            <Image
              src="/ornament-side-left.png"
              alt=""
              width={180}
              height={380}
              className="
                pointer-events-none
                absolute -left-[38px] top-[72px] z-[2]
                h-auto w-[115px] object-contain
              "
            />

            <Image
              src="/ornament-side-right.png"
              alt=""
              width={180}
              height={380}
              className="
                pointer-events-none
                absolute -right-[38px] top-[72px] z-[2]
                h-auto w-[115px] object-contain
              "
            />

            <div
              className="
                relative z-10
                flex h-full w-full flex-col
                items-center justify-center
                px-6 py-8
                text-center
              "
            >
              <p
                className="
                  text-[29px] font-medium leading-none
                  text-[#e1b954]
                "
              >
                ᬒᬁ ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ
              </p>

              <h2
                className="
                  mt-5
                  font-[family-name:var(--font-allura)]
                  text-[46px] font-normal leading-none
                  text-[#e1b954]
                "
              >
                Om Swastyastu
              </h2>

              <p
                className="
                  mx-auto mt-6 max-w-[390px]
                  text-[13px] font-medium
                  leading-[1.72]
                  text-white/95
                "
              >
                Atas Asung Kertha Wara Nugraha Ida Sang Hyang
                Widhi Wasa/Tuhan Yang Maha Esa, tanpa mengurangi
                rasa hormat kami mengundang Bapak/Ibu/Saudara/i
                untuk menghadiri Upacara Mepandes putra putri
                kami.
              </p>

              <div
                className="
                  relative mt-8
                  flex h-[182px] w-[182px]
                  shrink-0 items-center justify-center
                "
              >
                <div
                  className="
                    pointer-events-none
                    absolute inset-[-10px]
                    rounded-full
                    bg-[#e1b954]/20
                    blur-[18px]
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute inset-0
                    rounded-full
                    border-[3px] border-[#e1b954]
                    shadow-[0_0_12px_rgba(225,185,84,0.75),0_0_28px_rgba(225,185,84,0.38)]
                  "
                />

                <div
                  className="
                    relative h-[166px] w-[166px]
                    overflow-hidden rounded-full
                  "
                >
                  <Image
                    src="/person-1.jpg"
                    alt="Ni Putu Diana Dewi"
                    fill
                    priority
                    sizes="166px"
                    className="object-cover object-center"
                  />
                </div>
              </div>

              <h3
                className="
                  mt-7 max-w-[420px] px-2
                  font-[family-name:var(--font-allura)]
                  text-[30px] font-normal
                  leading-[1.08]
                  text-white
                "
              >
                Ni Putu Diana Dewi, S. Ked
              </h3>

              <div
                className="
                  mt-5 flex w-[220px]
                  items-center justify-center gap-3
                  text-[#e1b954]
                "
              >
                <span className="h-px flex-1 bg-[#e1b954]/60" />
                <span className="text-[12px]">✦</span>
                <span className="h-px flex-1 bg-[#e1b954]/60" />
              </div>

              <p
                className="
                  mt-4
                  text-[11px] font-semibold uppercase
                  tracking-[0.2em]
                  text-[#e1b954]
                "
              >
                Putri Dari
              </p>

              <p
                className="
                  mt-2
                  text-[14px] font-normal
                  leading-6
                  text-white/90
                "
              >
                Bapak I Gede Arya Darma Guna, S.H, M. Kn.
                <br />
                &
                <br />
                Ibu Ni Putu Dea Saraswati, S. Ked, Sp. A.
              </p>
            </div>
          </section>

          {/* =================================================
              PAGE 3 - PENUTUP
          ================================================== */}

          <section
            className="
              relative mx-auto
              w-full max-w-[460px]
              overflow-hidden bg-black
            "
          >
            <BackgroundPattern />

            <div
              className="
                relative z-10
                flex w-full flex-col
                items-center
                px-6 pb-12 pt-10
                text-center
              "
            >
              <div
                className="
                  mb-5 flex
                  items-center justify-center
                  text-[#e1b954]
                "
              >
                <span className="h-px w-[72px] bg-gradient-to-r from-transparent to-[#e1b954]" />

                <div
                  className="
                    relative mx-2
                    flex h-[48px] w-[48px]
                    items-center justify-center
                    rounded-full
                    border-2 border-[#e1b954]
                    text-[20px]
                  "
                >
                  ❀
                </div>

                <span className="h-px w-[72px] bg-gradient-to-l from-transparent to-[#e1b954]" />
              </div>

              <p className="mx-auto max-w-[400px] text-[14px] font-medium leading-[1.8] text-white/95">
                Suatu Kebahagiaan bagi kami apabila
                Bapak/Ibu/Saudara/i berkenan hadir dan
                memberikan doa restu kepada putra putri kami.
              </p>

              <p className="mt-5 text-[14px] font-medium">
                Kami yang berbahagia
              </p>

              <p className="mt-5 text-[32px] font-medium leading-none text-[#e1b954]">
                ᬒᬁᬰᬦ᭄ᬢᬶᬄᬰᬦ᭄ᬢᬶᬄᬰᬦ᭄ᬢᬶᬄᬒᬁ
              </p>

              <h2
                className="
                  mt-6 max-w-[420px]
                  font-[family-name:var(--font-allura)]
                  text-[35px]
                  text-[#e1b954]
                "
              >
                Om Santih Santih Santih Om
              </h2>
            </div>
          </section>

          {/* =================================================
              PAGE 4 - WAKTU & TEMPAT
          ================================================== */}

          <section className="relative mx-auto w-full max-w-[460px] overflow-hidden bg-black">
            <BackgroundPattern />

            <div
              className="
                relative z-10
                flex w-full flex-col
                items-center
                px-6 pb-12 pt-10
                text-center
              "
            >
              <SectionTitle title="Waktu & Tempat" />

              <div className="mb-5 text-[#e1b954]">
                <CalendarDays
                  className="h-12 w-12"
                  strokeWidth={1.8}
                />
              </div>

              <div
                className="
                  grid w-full
                  grid-cols-[1fr_auto_1fr]
                  items-center gap-4
                "
              >
                <div className="border-y border-white/50 py-4 text-[15px] font-medium">
                  Kamis
                </div>

                <div className="min-w-[78px]">
                  <p className="text-[42px] font-semibold italic leading-none">
                    01
                  </p>

                  <p className="mt-1 text-[17px]">
                    Oktober
                  </p>
                </div>

                <div className="border-y border-white/50 py-4 text-[15px] font-medium">
                  2026
                </div>
              </div>

              <div className="mt-9 grid w-full grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="flex flex-col items-center">
                  <div className="text-[#e1b954]">
                    <Clock3
                      className="h-12 w-12"
                      strokeWidth={1.8}
                    />
                  </div>

                  <p className="mt-3 text-[13px]">
                    Pukul :
                  </p>

                  <p className="mt-2 text-[15px] font-semibold">
                    15:00 WITA - Selesai
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-[#e1b954]">
                    <House
                      className="h-12 w-12"
                      strokeWidth={1.8}
                    />
                  </div>

                  <p className="mt-3 text-[13px]">
                    Tempat :
                  </p>

                  <p className="mt-2 max-w-[300px] text-[14px] font-semibold leading-[1.6]">
                    Jero Pesaji Kawan, Jl. Yeh Gangga I Desa
                    Sudimara, Banjar Sudimara Kelod, Tabanan
                  </p>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Jero+Pesaji+Kawan+Jl+Yeh+Gangga+I+Sudimara+Tabanan"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-8
                  inline-flex items-center justify-center
                  gap-2 rounded-md
                  border border-[#8f742e]
                  bg-[#e1b954]
                  px-5 py-3
                  text-[13px] font-semibold
                  text-[#3d3008]
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
                </svg>

                Lihat Lokasi di Peta
              </a>
            </div>
          </section>

          {/* =================================================
              PAGE 5 - COUNTDOWN
          ================================================== */}

          <section className="relative mx-auto w-full max-w-[460px] overflow-hidden bg-black">
            <BackgroundPattern />

            <div className="relative z-10 flex w-full flex-col items-center px-5 pb-12 pt-10 text-center">
              <h2 className="font-[family-name:var(--font-allura)] text-[46px] text-[#e1b954]">
                Menuju Hari Bahagia
              </h2>

              <div className="mt-10 grid w-full grid-cols-4 gap-2.5">
                {[
                  ["days", "Hari"],
                  ["hours", "Jam"],
                  ["minutes", "Menit"],
                  ["seconds", "Detik"],
                ].map(([key, label]) => (
                  <div
                    key={key}
                    className="
                      overflow-hidden
                      rounded-xl bg-white
                      shadow-[0_8px_25px_rgba(0,0,0,0.25)]
                    "
                  >
                    <div className="flex h-[88px] items-center justify-center">
                      <span className="text-[30px] font-medium text-[#2d2d2d]">
                        {formatNumber(
                          countdown[
                            key as keyof typeof countdown
                          ]
                        )}
                      </span>
                    </div>

                    <div className="flex h-[46px] items-center justify-center bg-[#e1b954]">
                      <span className="text-[12px] font-medium text-[#3d3008]">
                        {label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mx-auto mt-10 max-w-[400px] text-[14px] font-medium leading-[1.8]">
                Kami nantikan kehadiran para keluarga dan
                sahabat untuk menjadi saksi hari yang bahagia.
              </p>

              <a
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Upacara+Metatah&dates=20261001T070000Z/20261001T100000Z&details=Upacara+Metatah&location=Jero+Pesaji+Kawan%2C+Jl.+Yeh+Gangga+I+Desa+Sudimara%2C+Banjar+Sudimara+Kelod%2C+Tabanan"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-7
                  inline-flex items-center justify-center
                  gap-2.5 rounded-lg
                  border border-[#8f742e]
                  bg-[#e1b954]
                  px-6 py-3.5
                  text-[14px] font-semibold
                  text-[#3d3008]
                "
              >
                Save the Date
              </a>
            </div>
          </section>

          {/* =================================================
              PAGE 6 - QUOTE
          ================================================== */}

          <section className="relative mx-auto w-full max-w-[460px] overflow-hidden bg-black">
            <BackgroundPattern />

            <div className="relative z-10 flex w-full flex-col items-center px-7 pb-14 pt-10 text-center">
              <div className="text-[78px] font-bold leading-[0.6]">
                “
              </div>

              <p className="mt-9 max-w-[400px] text-[17px] font-medium italic leading-[1.8] text-[#e1b954]">
                “Dengan Yadnya, semoga kami memperoleh
                sifat-sifat kemuliaan, kejayaan, kekuatan
                rohani, kekuatan jasmani, kesejahteraan dan
                perlindungan”
              </p>

              <p className="mt-6 text-[15px] font-semibold italic text-[#e1b954]">
                (Yayurweda XV.113)
              </p>

              <Divider />
            </div>
          </section>

          {/* =================================================
              PAGE 7 - POTRET BAHAGIA KAMI
          ================================================== */}

          <section className="relative mx-auto w-full max-w-[460px] overflow-hidden bg-black">
            <BackgroundPattern />

            <div className="relative z-10 flex w-full flex-col items-center px-5 pb-14 pt-10 text-center">
              <SectionTitle title="Potret Bahagia Kami" />

              {/* FOTO UTAMA */}

              <div
                className="
                  relative mt-2
                  aspect-[4/3] w-full
                  overflow-hidden rounded-xl
                  border border-white/10
                  bg-black
                  shadow-[0_8px_28px_rgba(0,0,0,0.30)]
                "
              >
                {galleryImages.map((src, index) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`Potret bahagia ${index + 1}`}
                    fill
                    sizes="(max-width: 460px) 100vw, 460px"
                    priority={index === 0}
                    className={`
                      object-cover object-center
                      transition-all duration-700 ease-in-out
                      ${
                        activePhoto === index
                          ? "scale-100 opacity-100"
                          : "pointer-events-none scale-[1.03] opacity-0"
                      }
                    `}
                  />
                ))}

                <div
                  className="
                    pointer-events-none
                    absolute inset-0 z-10
                    bg-gradient-to-t
                    from-black/25 via-transparent to-transparent
                  "
                />

                <button
                  type="button"
                  onClick={showPreviousPhoto}
                  aria-label="Foto sebelumnya"
                  className="
                    absolute left-3 top-1/2 z-20
                    flex h-9 w-9
                    -translate-y-1/2
                    items-center justify-center
                    rounded-full
                    border border-[#e1b954]/70
                    bg-black/45
                    text-[24px] leading-none
                    text-[#e1b954]
                    backdrop-blur-sm
                    transition-all duration-300
                    hover:bg-black/70
                    active:scale-95
                  "
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={showNextPhoto}
                  aria-label="Foto selanjutnya"
                  className="
                    absolute right-3 top-1/2 z-20
                    flex h-9 w-9
                    -translate-y-1/2
                    items-center justify-center
                    rounded-full
                    border border-[#e1b954]/70
                    bg-black/45
                    text-[24px] leading-none
                    text-[#e1b954]
                    backdrop-blur-sm
                    transition-all duration-300
                    hover:bg-black/70
                    active:scale-95
                  "
                >
                  ›
                </button>

                <div
                  className="
                    absolute bottom-3 right-3 z-20
                    rounded-full
                    border border-white/15
                    bg-black/55
                    px-3 py-1
                    text-[10px] font-medium
                    text-white/90
                    backdrop-blur-sm
                  "
                >
                  {activePhoto + 1} / {galleryImages.length}
                </div>
              </div>

              {/* THUMBNAIL FOTO */}

              <div
                ref={thumbnailContainerRef}
                className="
                  mt-4 flex w-full
                  snap-x snap-mandatory
                  gap-2 overflow-x-auto
                  pb-2
                  [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden
                "
              >
                {galleryImages.map((src, index) => (
                  <button
                    key={src}
                    ref={(element) => {
                      thumbnailRefs.current[index] = element;
                    }}
                    type="button"
                    onClick={() => setActivePhoto(index)}
                    aria-label={`Tampilkan potret ${index + 1}`}
                    className={`
                      relative
                      h-[72px] w-[94px]
                      shrink-0 snap-center
                      overflow-hidden rounded-lg
                      border-2
                      transition-all duration-500
                      ${
                        activePhoto === index
                          ? "scale-100 border-[#e1b954] opacity-100 shadow-[0_0_14px_rgba(225,185,84,0.28)]"
                          : "scale-[0.96] border-white/10 opacity-55 hover:opacity-85"
                      }
                    `}
                  >
                    <Image
                      src={src}
                      alt={`Thumbnail potret ${index + 1}`}
                      fill
                      sizes="94px"
                      className="object-cover object-center"
                    />

                    {activePhoto === index && (
                      <div
                        className="
                          pointer-events-none
                          absolute inset-0
                          bg-[#e1b954]/10
                        "
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* INDIKATOR */}

              <div className="mt-3 flex items-center justify-center gap-1.5">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActivePhoto(index)}
                    aria-label={`Pilih foto ${index + 1}`}
                    className={`
                      h-1.5 rounded-full
                      transition-all duration-500
                      ${
                        activePhoto === index
                          ? "w-5 bg-[#e1b954]"
                          : "w-1.5 bg-white/25"
                      }
                    `}
                  />
                ))}
              </div>
            </div>
          </section>

{/* =================================================
    PAGE 8 - RSVP & UCAPAN
================================================== */}

<section
  className="
    relative mx-auto
    w-full max-w-[460px]
    overflow-hidden bg-black
  "
>
  <BackgroundPattern />

  <div
    className="
      relative z-10
      w-full
      px-5 pb-14 pt-10
    "
  >
    {/* TITLE */}

    <div className="text-center">
      <div
        className="
          mx-auto mb-3
          flex justify-center
          text-[#e1b954]
        "
      >
        <div
          className="
            flex h-[52px] w-[52px]
            items-center justify-center
            rounded-full
            border border-[#e1b954]
            text-[#e1b954]
          "
        >
          <Mail
            size={23}
            strokeWidth={1.7}
          />
        </div>
      </div>

      <h2
        className="
          font-[family-name:var(--font-allura)]
          text-[38px] font-normal
          leading-[1.15]
          text-[#e1b954]
        "
      >
        Konfirmasi Kehadiran
        <br />
        & Kirim Pesan Bahagia
      </h2>

      <p
        className="
          mx-auto mt-4
          max-w-[360px]
          text-[12px]
          leading-[1.7]
          text-white/70
        "
      >
        Silakan konfirmasi kehadiran dan tinggalkan
        ucapan terbaik untuk kami.
      </p>
    </div>

    {/* FORM RSVP */}

    <form
      onSubmit={handleSubmitRsvp}
      className="mt-8"
    >
      {/* NAMA */}

      <div>
        <label
          htmlFor="rsvp-name"
          className="
            mb-2 block
            text-[13px] font-semibold
            text-white
          "
        >
          Nama
        </label>

        <input
          id="rsvp-name"
          type="text"
          value={rsvpName}
          onChange={(event) =>
            setRsvpName(event.target.value)
          }
          placeholder="Masukkan nama"
          className="
            h-[48px] w-full
            rounded-lg
            border border-white/15
            bg-white
            px-4
            text-[14px]
            text-[#222]
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-[#e1b954]
            focus:ring-2
            focus:ring-[#e1b954]/20
          "
        />
      </div>

      {/* UCAPAN */}

      <div className="mt-5">
        <label
          htmlFor="rsvp-message"
          className="
            mb-2 block
            text-[13px] font-semibold
            text-white
          "
        >
          Ucapan
        </label>

        <textarea
          id="rsvp-message"
          value={rsvpMessage}
          onChange={(event) =>
            setRsvpMessage(event.target.value)
          }
          placeholder="Tulis ucapan di sini"
          rows={5}
          className="
            w-full resize-none
            rounded-lg
            border border-white/15
            bg-white
            px-4 py-3
            text-[14px]
            leading-6
            text-[#222]
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-[#e1b954]
            focus:ring-2
            focus:ring-[#e1b954]/20
          "
        />
      </div>

      {/* STATUS */}

      <div
        className="
          mt-5
          flex flex-wrap
          gap-x-5 gap-y-3
        "
      >
        {[
          "Hadir",
          "Tidak Hadir",
          "Belum Konfirmasi",
        ].map((status) => (
          <label
            key={status}
            className="
              flex cursor-pointer
              items-center gap-2
              text-[12px]
              font-medium
              text-white/90
            "
          >
            <input
              type="radio"
              name="rsvp-status"
              value={status}
              checked={rsvpStatus === status}
              onChange={() =>
                setRsvpStatus(
                  status as RsvpStatus
                )
              }
              className="
                h-4 w-4
                accent-[#e1b954]
              "
            />

            {status}
          </label>
        ))}
      </div>

      {/* INFO */}

      {rsvpInfo && (
        <p
          className="
            mt-5
            text-center
            text-[12px]
            leading-5
            text-[#e1b954]
          "
        >
          {rsvpInfo}
        </p>
      )}

      {/* BUTTON */}

      <div className="mt-7 flex justify-center">
        <button
          type="submit"
          disabled={sendingRsvp}
          className="
            min-w-[190px]
            rounded-lg
            border border-[#8f742e]
            bg-[#e1b954]
            px-6 py-3.5
            text-[13px] font-semibold
            text-[#3d3008]
            shadow-[0_6px_20px_rgba(0,0,0,0.28)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:bg-[#edc967]
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {sendingRsvp
            ? "Mengirim..."
            : "Konfirmasi Kehadiran"}
        </button>
      </div>
    </form>

    {/* =========================
        DAFTAR UCAPAN
    ========================== */}

    <div className="mt-12">
      <div
        className="
          flex items-end justify-between
          border-b border-[#e1b954]/50
          pb-3
        "
      >
        <h3 className="text-[15px] font-semibold text-white">
          {rsvpList.length} Ucapan
        </h3>

        <span className="text-[11px] text-white/50">
          Pesan Bahagia
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {visibleRsvp.length === 0 && (
          <div
            className="
              rounded-xl
              border border-white/10
              bg-white/[0.04]
              px-5 py-8
              text-center
            "
          >
            <p className="text-[13px] text-white/60">
              Belum ada ucapan.
            </p>

            <p className="mt-1 text-[12px] text-white/40">
              Jadilah yang pertama mengirim pesan bahagia.
            </p>
          </div>
        )}

        {visibleRsvp.map((item) => (
          <div
            key={item.id}
            className="
              rounded-xl
              border border-white/10
              bg-white/[0.96]
              p-4
              text-[#252525]
              shadow-[0_5px_18px_rgba(0,0,0,0.15)]
            "
          >
            <div className="flex items-start gap-3">
              {/* AVATAR */}

              <div
                className="
                  flex h-10 w-10
                  shrink-0
                  items-center justify-center
                  rounded-full
                  bg-[#8b8b8b]
                  text-white
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className="
                    flex flex-wrap
                    items-center gap-2
                  "
                >
                  <p
                    className="
                      break-words
                      text-[14px]
                      font-semibold
                      text-[#222]
                    "
                  >
                    {item.name}
                  </p>

                  <span
                    className={`
                      rounded-md
                      px-2 py-1
                      text-[9px]
                      font-semibold
                      ${
                        item.status === "Hadir"
                          ? "bg-[#f3c65c] text-[#4b3905]"
                          : item.status === "Tidak Hadir"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-600"
                      }
                    `}
                  >
                    {item.status}
                  </span>
                </div>

                <div
                  className="
                    mt-1
                    flex items-center gap-1.5
                    text-[10px]
                    text-gray-500
                  "
                >
                  <span>◷</span>

                  <span>
                    {formatRsvpDate(
                      item.createdAt
                    )}
                  </span>
                </div>
              </div>
            </div>

            <p
              className="
                mt-4
                whitespace-pre-line
                break-words
                text-[13px]
                leading-[1.65]
                text-[#272727]
              "
            >
              {item.message}
            </p>
          </div>
        ))}
      </div>

      {/* LIHAT LEBIH BANYAK */}

      {rsvpList.length > 5 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() =>
              setShowAllRsvp(
                (previous) => !previous
              )
            }
            className="
              min-w-[170px]
              rounded-lg
              border border-[#8f742e]
              bg-[#e1b954]
              px-5 py-3
              text-[12px] font-semibold
              text-[#3d3008]
              transition-all duration-300
              hover:bg-[#edc967]
              active:scale-[0.98]
            "
          >
            {showAllRsvp
              ? "Tampilkan Lebih Sedikit"
              : "Lihat Lebih Banyak"}
          </button>
        </div>
      )}
    </div>
  </div>
</section>

          {/* =================================================
              FOOTER
          ================================================== */}

          <footer
  className="
    relative mx-auto
    w-full max-w-[460px]
    overflow-hidden
    bg-black
  "
>
  <BackgroundPattern />

  <div
    className="
      relative z-10
      flex flex-col
      items-center
      px-6 pb-8 pt-6
      text-center
    "
  >
    <div
      className="
        flex items-center
        justify-center
        text-[#e1b954]
      "
    >
      <span
        className="
          h-px w-[55px]
          bg-gradient-to-r
          from-transparent
          to-[#e1b954]
        "
      />

      <Image
        src="/footer-ornament.png"
        alt="Ornamen"
        width={88}
        height={88}
        className="mx-3 h-auto w-[100px] object-contain"
      />

      <span
        className="
          h-px w-[55px]
          bg-gradient-to-l
          from-transparent
          to-[#e1b954]
        "
      />
    </div>

    <p
      className="
        font-[family-name:var(--font-allura)]
        text-[30px]
        text-[#e1b954]
      "
    >
      Terima Kasih
    </p>

    <p
      className="
        mt-2
        max-w-[340px]
        text-[11px]
        leading-[1.7]
        text-white/60
      "
    >
      Terima kasih atas doa, perhatian, dan kebersamaan yang diberikan
      dalam hari bahagia kami.
    </p>

    <p
      className="
        mt-6
        text-[10px]
        tracking-[0.08em]
        text-white/35
      "
    >
      Design By : Surya Pratama
    </p>
  </div>
</footer>
        </>
      )}
    </main>
  );
}

/* =====================================================
   BACKGROUND PATTERN
===================================================== */

function BackgroundPattern() {
  return (
    <div
      className="
        pointer-events-none
        absolute inset-0 z-[1]
        bg-[url('/background.png')]
        bg-repeat opacity-[0.10]
      "
      style={{
        backgroundSize: "230px auto",
        backgroundPosition: "center top",
      }}
    />
  );
}

/* =====================================================
   SECTION TITLE
===================================================== */

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <div className="mb-7 flex flex-col items-center">
      <div className="mb-2 flex items-center text-[#e1b954]">
        <span className="h-px w-12 bg-[#e1b954]/60" />
        <span className="mx-3 text-[18px]">✦</span>
        <span className="h-px w-12 bg-[#e1b954]/60" />
      </div>

      <h2
        className="
          font-[family-name:var(--font-allura)]
          text-[44px]
          font-normal
          leading-none
          text-[#e1b954]
        "
      >
        {title}
      </h2>

      <div className="mt-2 flex items-center text-[#e1b954]">
        <span className="h-px w-12 bg-[#e1b954]/60" />
        <span className="mx-3 text-[18px]">✦</span>
        <span className="h-px w-12 bg-[#e1b954]/60" />
      </div>
    </div>
  );
}

/* =====================================================
   DIVIDER
===================================================== */

function Divider() {
  return (
    <div className="mt-14 flex items-center justify-center text-[#e1b954]">
      <span className="h-px w-[70px] bg-gradient-to-r from-transparent to-[#e1b954]" />

      <div
        className="
          mx-3
          flex h-[38px] w-[38px]
          items-center justify-center
          rounded-full
          border-2 border-[#e1b954]
          text-[15px]
        "
      >
        ✦
      </div>

      <span className="h-px w-[70px] bg-gradient-to-l from-transparent to-[#e1b954]" />
    </div>
  );
}