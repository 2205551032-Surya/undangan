"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

function InvitationPage() {
  const searchParams = useSearchParams();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [guestName, setGuestName] = useState("Ti A.k 22");
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const to = searchParams.get("to");

    if (!to) return;

    const formattedName = to
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    setGuestName(formattedName);
  }, [searchParams]);

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

    setTimeout(() => {
      setOpened(true);

      setTimeout(() => {
        document
          .getElementById("invitation")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 150);
    }, 1500);
  };

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

      {/* =========================
          AUDIO
      ========================== */}

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
            fixed
            bottom-5
            right-5
            z-[999]
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-[#e1b954]
            bg-black/70
            text-[#e1b954]
            shadow-lg
            backdrop-blur
          "
        >
          <span
            className={`
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-[#e1b954]

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
          COVER
      ====================================================== */}

      <section
        className="
          relative
          mx-auto
          h-svh
          min-h-[680px]
          w-full
          max-w-[460px]
          overflow-hidden
          bg-black
        "
      >

        {/* BACKGROUND */}

        <div
          className={`
            absolute
            inset-0
            bg-[url('/center1.jpg')]
            bg-cover
            bg-center
            bg-no-repeat

            transition-transform
            duration-[1800ms]

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
            absolute
            inset-0
            z-[1]

            transition-all
            duration-[1200ms]

            ${
              opening
                ? "bg-[linear-gradient(to_bottom,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.73)_25%,rgba(0,0,0,0.67)_50%,rgba(0,0,0,0.82)_100%)]"
                : "bg-[linear-gradient(to_bottom,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.68)_25%,rgba(0,0,0,0.62)_50%,rgba(0,0,0,0.72)_75%,rgba(0,0,0,0.90)_100%)]"
            }
          `}
        />

        {/* =========================
            CORNER ORNAMENT
        ========================== */}

        <Image
          src="/ornament-top-left.png"
          alt=""
          width={180}
          height={180}
          priority
          className={`
            pointer-events-none
            absolute
            left-3
            top-3
            z-[5]
            h-auto
            w-[95px]
            object-contain

            transition-all
            duration-700

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
            absolute
            right-3
            top-3
            z-[5]
            h-auto
            w-[95px]
            object-contain

            transition-all
            duration-700

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
            absolute
            bottom-1.5
            left-1.5
            z-[5]
            h-auto
            w-[112px]
            object-contain

            transition-all
            duration-700

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
            absolute
            bottom-1.5
            right-1.5
            z-[5]
            h-auto
            w-[112px]
            object-contain

            transition-all
            duration-700

            ${
              opening
                ? "scale-110 opacity-0 blur-sm"
                : "scale-100 opacity-100"
            }
          `}
        />

        {/* =========================
            COVER CONTENT
        ========================== */}

        <div
          className="
            relative
            z-[4]
            flex
            h-full
            w-full
            flex-col
            items-center
            justify-between
            px-6
            pb-10
            pt-24
            text-center
          "
        >

          {/* CENTER */}

          <div
            className={`
              mb-auto
              mt-auto

              flex
              w-full
              flex-col
              items-center

              transition-transform
              duration-[1300ms]

              [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]

              ${
                opening
                  ? "translate-y-0"
                  : "-translate-y-8"
              }
            `}
          >

            {/* ORNAMENT CENTER */}

            <div
              className={`
                mb-3

                flex
                min-h-[72px]
                w-[145px]
                items-center
                justify-center

                transition-all
                duration-[1300ms]

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
                className="
                  h-auto
                  w-full
                  object-contain
                "
              />
            </div>

            {/* UNDANGAN */}

            <div
              className="
                flex
                w-full
                items-center
                justify-center
                gap-3
              "
            >
              <span
                className="
                  h-px
                  max-w-[100px]
                  flex-1
                  bg-white/70
                "
              />

              <p
                className="
                  text-[13px]
                  font-medium
                  tracking-wide
                "
              >
                UNDANGAN
              </p>

              <span
                className="
                  h-px
                  max-w-[100px]
                  flex-1
                  bg-white/70
                "
              />
            </div>

            {/* METATAH */}

            <h1
              className="
                mt-4

                font-[family-name:var(--font-allura)]

                text-[68px]
                font-normal
                leading-none

                text-white

                drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)]
              "
            >
              Metatah
            </h1>

            {/* DATE */}

            <p
              className="
                mt-5

                text-sm
                font-semibold

                tracking-[0.12em]

                text-white
              "
            >
              01.10.2026
            </p>
          </div>

          {/* =========================
              GUEST
          ========================== */}

          <div
            className={`
              w-full
              shrink-0

              transition-all
              duration-700

              ${
                opening
                  ? "pointer-events-none translate-y-8 opacity-0 blur-sm"
                  : "translate-y-0 opacity-100"
              }
            `}
          >
            <p
              className="
                mb-3
                text-sm
                font-semibold
              "
            >
              kpd. Bpk/Ibu/Saudara/i
            </p>

            <div
              className="
                flex
                min-h-[48px]
                w-full
                items-center
                justify-center

                rounded-md

                border
                border-white/80

                bg-black/25

                px-4
                py-3

                text-[15px]
                font-medium
                capitalize

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
                mt-8

                min-w-[140px]

                rounded-lg

                border-2
                border-[#8f742e]

                bg-[#e1b954]

                px-5
                py-3

                text-[13px]
                font-semibold
                text-[#3d3008]

                outline
                outline-2
                outline-white/90

                shadow-[0_4px_16px_rgba(0,0,0,0.35)]

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:bg-[#edc967]

                active:scale-[0.97]
              "
            >
              Buka Undangan
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          ISI UNDANGAN
      ====================================================== */}

      {opened && (
        <section
          id="invitation"
          className="
            relative

            mx-auto

            min-h-screen
            w-full
            max-w-[460px]

            overflow-hidden

            bg-[#211207]

            [animation:invitation-reveal_850ms_ease_both]
          "
        >

          {/* =================================================
              ORNAMENT SAMPING KIRI ATAS
          ================================================== */}

          <Image
            src="/ornament-side-left.png"
            alt=""
            width={180}
            height={380}
            className="
              pointer-events-none

              absolute
              -left-[35px]
              top-[60px]

              z-[1]

              h-auto
              w-[110px]

              object-contain

              opacity-90
            "
          />

          {/* =================================================
              ORNAMENT SAMPING KANAN ATAS
          ================================================== */}

          <Image
            src="/ornament-side-right.png"
            alt=""
            width={180}
            height={380}
            className="
              pointer-events-none

              absolute
              -right-[35px]
              top-[60px]

              z-[1]

              h-auto
              w-[110px]

              object-contain

              opacity-90
            "
          />

          {/* =================================================
              ORNAMENT SAMPING KIRI TENGAH
          ================================================== */}

          <Image
            src="/ornament-side-left.png"
            alt=""
            width={180}
            height={380}
            className="
              pointer-events-none

              absolute
              -left-[48px]
              top-[680px]

              z-[1]

              h-auto
              w-[120px]

              object-contain

              opacity-70
            "
          />

          {/* =================================================
              ORNAMENT SAMPING KANAN TENGAH
          ================================================== */}

          <Image
            src="/ornament-side-right.png"
            alt=""
            width={180}
            height={380}
            className="
              pointer-events-none

              absolute
              -right-[48px]
              top-[680px]

              z-[1]

              h-auto
              w-[120px]

              object-contain

              opacity-70
            "
          />

          {/* =================================================
              CONTENT
          ================================================== */}

          <div
            className="
              relative
              z-[2]

              px-7
              pb-28
              pt-20

              text-center
            "
          >

            {/* LABEL */}

            <p
              className="
                text-[11px]
                font-medium

                tracking-[0.28em]

                text-[#e1b954]
              "
            >
              UNDANGAN METATAH
            </p>

            {/* DIVIDER */}

            <div
              className="
                mx-auto
                my-10

                flex
                w-[270px]
                max-w-[90%]
                items-center

                gap-4

                text-[#e1b954]
              "
            >
              <span
                className="
                  h-px
                  flex-1
                  bg-[#e1b954]/70
                "
              />

              <b
                className="
                  text-lg
                  text-[#e1b954]
                "
              >
                ✦
              </b>

              <span
                className="
                  h-px
                  flex-1
                  bg-[#e1b954]/70
                "
              />
            </div>

            {/* BALINESE */}

            <p
              className="
                text-[30px]
                text-[#e1b954]
              "
            >
              ᬒᬁ ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ
            </p>

            {/* OM SWASTYASTU */}

            <h3
              className="
                mt-1

                font-[family-name:var(--font-playfair)]

                text-[25px]
                font-semibold

                text-white
              "
            >
              Om Swastyastu
            </h3>

            {/* TEXT */}

            <p
              className="
                mx-auto
                mt-7

                max-w-[370px]

                font-[family-name:var(--font-playfair)]

                text-[14px]

                leading-[2.45]

                text-[#f0e7df]
              "
            >
              Atas Asung Kertha Wara Nugraha Ida Sang
              Hyang Widhi Wasa/Tuhan Yang Maha Esa, tanpa mengurangi rasa
              hormat kami mengundang Bapak/Ibu/Saudara/i
              untuk menghadiri Upacara Mepandes putra
              putri kami.
            </p>

            {/* =================================================
                EVENT
            ================================================== */}

            <section
              className="
                mt-[105px]
              "
            >

              <p
                className="
                  text-[10px]
                  font-semibold

                  tracking-[0.32em]

                  text-[#e1b954]
                "
              >
                WAKTU & TEMPAT
              </p>

              <h2
                className="
                  mt-3

                  font-[family-name:var(--font-allura)]

                  text-[55px]
                  font-normal

                  leading-none

                  text-white
                "
              >
                Upacara Mepandes
              </h2>

              {/* DATE CARD */}

              <div
                className="
                  mx-auto
                  mt-12

                  flex
                  h-[180px]
                  w-[150px]

                  flex-col
                  items-center
                  justify-center

                  gap-1

                  border
                  border-[#e1b954]/70

                  bg-black/10
                "
              >
                <span
                  className="
                    text-sm
                    text-white
                  "
                >
                  Kamis
                </span>

                <strong
                  className="
                    font-[family-name:var(--font-playfair)]

                    text-[55px]

                    leading-none

                    text-[#e1b954]
                  "
                >
                  01
                </strong>

                <span className="text-sm">
                  Oktober
                </span>

                <small
                  className="
                    text-[11px]
                    opacity-70
                  "
                >
                  2026
                </small>
              </div>

              {/* TIME */}

              <p
                className="
                  mt-8

                  text-[10px]
                  uppercase

                  tracking-[0.2em]

                  text-[#e1b954]
                "
              >
                Pukul
              </p>

              <strong
                className="
                  mt-2
                  block

                  text-[15px]
                "
              >
                15:00 WITA - Selesai
              </strong>

              {/* LOCATION */}

              <p
                className="
                  mt-8

                  text-[10px]
                  uppercase

                  tracking-[0.2em]

                  text-[#e1b954]
                "
              >
                Tempat
              </p>

              <strong
                className="
                  mt-2
                  block

                  text-[15px]
                "
              >
                Jero Pesaji Kawan
              </strong>

              <p
                className="
                  mx-auto
                  mt-4

                  max-w-[320px]

                  text-[13px]

                  leading-7

                  text-white/80
                "
              >
                Jl. Yeh Gangga I Desa Sudimara,
                Banjar Sudimara Kelod, Tabanan
              </p>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-7

                  inline-block

                  rounded-md

                  border
                  border-[#e1b954]

                  px-5
                  py-3

                  text-sm
                  font-medium

                  text-[#e1b954]

                  transition-all
                  duration-300

                  hover:bg-[#e1b954]
                  hover:text-[#211207]
                "
              >
                Lihat Lokasi
              </a>

            </section>
          </div>
        </section>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#151515]" />
      }
    >
      <InvitationPage />
    </Suspense>
  );
}