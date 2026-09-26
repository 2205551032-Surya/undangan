"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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

    setGuestName(capitalizedGuest || "Tamu");
  }, [pathname]);

  /* =========================
     COUNTDOWN
     1 OKTOBER 2026
     15:00 WITA
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

  return (
    <main className="min-h-screen w-full bg-[#151515] text-white">
      <audio
        ref={audioRef}
        src="/gus-teja.mp3"
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
        {/* BACKGROUND */}

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

        {/* OVERLAY */}

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

        {/* CORNER ORNAMENTS */}

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

        {/* COVER CONTENT */}

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
                src="/ornament-center.png"
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

          {/* GUEST */}

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

      {/* =====================================================
          PAGE 2 - PAGE 6
      ====================================================== */}

      {opened && (
        <>
          {/* =================================================
              PAGE 2
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
                  drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]
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
                  drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]
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
                Atas Asung Kertha Wara Nugraha Ida Sang
                Hyang Widhi Wasa/Tuhan Yang Maha Esa,
                tanpa mengurangi rasa hormat kami
                mengundang Bapak/Ibu/Saudara/i untuk
                menghadiri Upacara Mepandes putra putri
                kami.
              </p>

              {/* FOTO */}

              <div
                className="
                  relative mt-8
                  flex h-[182px] w-[182px]
                  shrink-0 items-center justify-center
                "
              >
                <div
                  className="
                    absolute inset-0
                    rounded-full
                    border-[3px] border-[#e1b954]
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

              {/* NAMA */}

              <h3
                className="
                  mt-7 max-w-[420px] px-2
                  font-[family-name:var(--font-allura)]
                  text-[30px] font-normal
                  leading-[1.08]
                  text-white
                  drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]
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
                  font-[family-name:var(--font-playfair)]
                  text-[14px] leading-6
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
              h-[100svh] min-h-[720px]
              w-full max-w-[460px]
              overflow-hidden bg-black
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

            <div
              className="
                relative z-10
                flex h-full w-full flex-col
                items-center justify-center
                px-6 py-8
                text-center
              "
            >
              <div
                className="
                  mb-7 flex
                  items-center justify-center
                  text-[#e1b954]
                "
              >
                <span
                  className="
                    h-px w-[72px]
                    bg-gradient-to-r
                    from-transparent to-[#e1b954]
                  "
                />

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

                <span
                  className="
                    h-px w-[72px]
                    bg-gradient-to-l
                    from-transparent to-[#e1b954]
                  "
                />
              </div>

              <p
                className="
                  mx-auto max-w-[400px]
                  text-[14px] font-medium
                  leading-[1.8]
                  text-white/95
                "
              >
                Suatu Kebahagiaan bagi kami apabila
                Bapak/Ibu/Saudara/i berkenan hadir dan
                memberikan doa restu kepada putra putri kami.
              </p>

              <p className="mt-6 text-[14px] font-medium">
                Kami yang berbahagia
              </p>

              <p
                className="
                  mt-6
                  text-[32px] font-medium leading-none
                  text-[#e1b954]
                  drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]
                "
              >
                ᬒᬁᬰᬦ᭄ᬢᬶᬄᬰᬦ᭄ᬢᬶᬄᬰᬦ᭄ᬢᬶᬄᬒᬁ
              </p>

              <h2
                className="
                  mt-4 max-w-[420px] px-2
                  font-[family-name:var(--font-allura)]
                  text-[35px] font-normal leading-[1.1]
                  text-[#e1b954]
                  drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]
                "
              >
                Om Santih Santih Santih Om
              </h2>
            </div>
          </section>

          {/* =================================================
              PAGE 4 - WAKTU & TEMPAT
          ================================================== */}

          <section
            className="
              relative mx-auto
              h-[100svh] min-h-[760px]
              w-full max-w-[460px]
              overflow-hidden bg-black
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

            <div
              className="
                relative z-10
                flex h-full w-full flex-col
                items-center justify-center
                px-6 py-8
                text-center
              "
            >
              {/* TITLE */}

              <div className="mb-7 flex flex-col items-center">
                <div
                  className="
                    mb-2 flex
                    items-center justify-center
                    text-[#e1b954]
                  "
                >
                  <span className="h-px w-12 bg-[#e1b954]/60" />

                  <span className="mx-3 text-[18px] text-[#e1b954]">
                    ❦
                  </span>

                  <span className="h-px w-12 bg-[#e1b954]/60" />
                </div>

                <h2
                  className="
                    font-[family-name:var(--font-allura)]
                    text-[44px] leading-none
                    text-[#e1b954]
                    drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]
                  "
                >
                  Waktu &amp; Tempat
                </h2>

                <div
                  className="
                    mt-2 flex
                    items-center justify-center
                    text-[#e1b954]
                  "
                >
                  <span className="h-px w-12 bg-[#e1b954]/60" />

                  <span className="mx-3 text-[18px] text-[#e1b954]">
                    ❦
                  </span>

                  <span className="h-px w-12 bg-[#e1b954]/60" />
                </div>
              </div>

              {/* CALENDAR */}

              <div className="mb-5 text-[#e1b954]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-12 w-12"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="2"
                  />
                  <path d="M16 3v4M8 3v4M3 10h18" />
                  <path d="M8 14h2M14 14h2M8 18h2M14 18h2" />
                </svg>
              </div>

              {/* DATE */}

              <div
                className="
                  grid w-full
                  grid-cols-[1fr_auto_1fr]
                  items-center gap-4
                "
              >
                <div
                  className="
                    border-y border-white/50
                    py-4
                    text-[15px] font-medium
                  "
                >
                  Kamis
                </div>

                <div className="min-w-[78px]">
                  <p
                    className="
                      font-[family-name:var(--font-playfair)]
                      text-[42px] font-semibold
                      italic leading-none
                    "
                  >
                    01
                  </p>

                  <p className="mt-1 text-[17px]">
                    Oktober
                  </p>
                </div>

                <div
                  className="
                    border-y border-white/50
                    py-4
                    text-[15px] font-medium
                  "
                >
                  2026
                </div>
              </div>

              {/* TIME + PLACE */}

              <div
                className="
                  mt-9
                  grid w-full grid-cols-1
                  gap-8
                  sm:grid-cols-2
                "
              >
                {/* TIME */}

                <div className="flex flex-col items-center justify-start">
                  <div className="text-[#e1b954]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-12 w-12"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v6l4 2" />
                    </svg>
                  </div>

                  <p className="mt-3 text-[13px]">
                    Pukul :
                  </p>

                  <p className="mt-2 text-[15px] font-semibold leading-6">
                    15:00 WITA - Selesai
                  </p>
                </div>

                {/* PLACE */}

                <div className="flex flex-col items-center justify-start">
                  <div className="text-[#e1b954]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-12 w-12"
                    >
                      <path d="M4 21V10l8-6 8 6v11" />
                      <path d="M9 21v-6h6v6" />
                      <path d="M16 8h4v13" />
                      <path d="M17 12h2M17 16h2" />
                    </svg>
                  </div>

                  <p className="mt-3 text-[13px]">
                    Tempat :
                  </p>

                  <p
                    className="
                      mt-2 max-w-[300px]
                      text-[14px] font-semibold
                      leading-[1.6]
                    "
                  >
                    Jero Pesaji Kawan,
                    Jl. Yeh Gangga I Desa Sudimara,
                    Banjar Sudimara Kelod, Tabanan
                  </p>
                </div>
              </div>

              {/* MAP */}

              <a
                href="https://www.google.com/maps/search/?api=1&query=Jero+Pesaji+Kawan+Jl+Yeh+Gangga+I+Sudimara+Tabanan"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-8
                  inline-flex items-center justify-center
                  gap-2
                  rounded-md
                  border border-[#8f742e]
                  bg-[#e1b954]
                  px-5 py-3
                  text-[13px] font-semibold
                  text-[#3d3008]
                  shadow-[0_5px_18px_rgba(0,0,0,0.25)]
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#edc967]
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
              PAGE 5 - MENUJU HARI BAHAGIA
          ================================================== */}

          <section
            className="
              relative mx-auto
              h-[100svh] min-h-[720px]
              w-full max-w-[460px]
              overflow-hidden bg-black
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

            <div
              className="
                relative z-10
                flex h-full w-full flex-col
                items-center justify-center
                px-5 py-8
                text-center
              "
            >
              {/* TITLE */}

              <h2
                className="
                  font-[family-name:var(--font-allura)]
                  text-[46px] font-normal leading-none
                  text-[#e1b954]
                  drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]
                "
              >
                Menuju Hari Bahagia
              </h2>

              {/* COUNTDOWN */}

              <div
                className="
                  mt-10
                  grid w-full
                  grid-cols-4
                  gap-2.5
                "
              >
                {/* HARI */}

                <div
                  className="
                    overflow-hidden
                    rounded-xl bg-white
                    shadow-[0_8px_25px_rgba(0,0,0,0.25)]
                  "
                >
                  <div className="flex h-[88px] items-center justify-center">
                    <span className="text-[30px] font-medium text-[#2d2d2d]">
                      {formatNumber(countdown.days)}
                    </span>
                  </div>

                  <div
                    className="
                      flex h-[46px]
                      items-center justify-center
                      bg-[#e1b954]
                    "
                  >
                    <span className="text-[12px] font-medium text-[#3d3008]">
                      Hari
                    </span>
                  </div>
                </div>

                {/* JAM */}

                <div
                  className="
                    overflow-hidden
                    rounded-xl bg-white
                    shadow-[0_8px_25px_rgba(0,0,0,0.25)]
                  "
                >
                  <div className="flex h-[88px] items-center justify-center">
                    <span className="text-[30px] font-medium text-[#2d2d2d]">
                      {formatNumber(countdown.hours)}
                    </span>
                  </div>

                  <div
                    className="
                      flex h-[46px]
                      items-center justify-center
                      bg-[#e1b954]
                    "
                  >
                    <span className="text-[12px] font-medium text-[#3d3008]">
                      Jam
                    </span>
                  </div>
                </div>

                {/* MENIT */}

                <div
                  className="
                    overflow-hidden
                    rounded-xl bg-white
                    shadow-[0_8px_25px_rgba(0,0,0,0.25)]
                  "
                >
                  <div className="flex h-[88px] items-center justify-center">
                    <span className="text-[30px] font-medium text-[#2d2d2d]">
                      {formatNumber(countdown.minutes)}
                    </span>
                  </div>

                  <div
                    className="
                      flex h-[46px]
                      items-center justify-center
                      bg-[#e1b954]
                    "
                  >
                    <span className="text-[12px] font-medium text-[#3d3008]">
                      Menit
                    </span>
                  </div>
                </div>

                {/* DETIK */}

                <div
                  className="
                    overflow-hidden
                    rounded-xl bg-white
                    shadow-[0_8px_25px_rgba(0,0,0,0.25)]
                  "
                >
                  <div className="flex h-[88px] items-center justify-center">
                    <span className="text-[30px] font-medium text-[#2d2d2d]">
                      {formatNumber(countdown.seconds)}
                    </span>
                  </div>

                  <div
                    className="
                      flex h-[46px]
                      items-center justify-center
                      bg-[#e1b954]
                    "
                  >
                    <span className="text-[12px] font-medium text-[#3d3008]">
                      Detik
                    </span>
                  </div>
                </div>
              </div>

              {/* TEXT */}

              <p
                className="
                  mx-auto mt-10
                  max-w-[400px]
                  text-[14px] font-medium
                  leading-[1.8]
                  text-white/95
                "
              >
                Kami nantikan kehadiran para keluarga dan
                sahabat untuk menjadi saksi hari yang bahagia.
              </p>

              {/* SAVE DATE */}

              <a
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Upacara+Metatah&dates=20261001T070000Z/20261001T100000Z&details=Upacara+Metatah&location=Jero+Pesaji+Kawan%2C+Jl.+Yeh+Gangga+I+Desa+Sudimara%2C+Banjar+Sudimara+Kelod%2C+Tabanan"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-7
                  inline-flex items-center justify-center
                  gap-2.5
                  rounded-lg
                  border border-[#8f742e]
                  bg-[#e1b954]
                  px-6 py-3.5
                  text-[14px] font-semibold
                  text-[#3d3008]
                  shadow-[0_6px_20px_rgba(0,0,0,0.28)]
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#edc967]
                  active:scale-[0.98]
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="2"
                  />
                  <path d="M16 3v4M8 3v4M3 10h18" />
                  <path d="m9 15 2 2 4-4" />
                </svg>

                Save the Date
              </a>
            </div>
          </section>

          {/* =================================================
              PAGE 6 - QUOTE YADNYA
          ================================================== */}

          <section
            className="
              relative mx-auto
              h-[100svh] min-h-[720px]
              w-full max-w-[460px]
              overflow-hidden bg-black
            "
          >
            {/* BACKGROUND */}

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

            {/* CONTENT */}

            <div
              className="
                relative z-10
                flex h-full w-full flex-col
                items-center justify-center
                px-7 py-8
                text-center
              "
            >
              {/* QUOTE ICON */}

              <div
                className="
                  font-[family-name:var(--font-playfair)]
                  text-[78px]
                  font-bold
                  leading-[0.6]
                  text-white
                "
              >
                “
              </div>

              {/* QUOTE */}

              <p
                className="
                  mt-9
                  max-w-[400px]
                  font-[family-name:var(--font-playfair)]
                  text-[17px]
                  font-medium
                  italic
                  leading-[1.8]
                  text-[#e1b954]
                "
              >
                “Dengan Yadnya, semoga kami memperoleh
                sifat-sifat kemuliaan, kejayaan, kekuatan
                rohani, kekuatan jasmani, kesejahteraan dan
                perlindungan”
              </p>

              {/* SOURCE */}

              <p
                className="
                  mt-6
                  font-[family-name:var(--font-playfair)]
                  text-[15px]
                  font-semibold
                  italic
                  text-[#e1b954]
                "
              >
                (Yayurweda XV.113)
              </p>

              {/* ORNAMENT */}

              <div
                className="
                  mt-14
                  flex items-center justify-center
                  text-[#e1b954]
                "
              >
                <span
                  className="
                    h-px w-[70px]
                    bg-gradient-to-r
                    from-transparent
                    to-[#e1b954]
                  "
                />

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
                  ❦
                </div>

                <span
                  className="
                    h-px w-[70px]
                    bg-gradient-to-l
                    from-transparent
                    to-[#e1b954]
                  "
                />
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}