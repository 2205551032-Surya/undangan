"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
} from "react";

export default function InvitationPage() {
  const pathname = usePathname();

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const [guestName, setGuestName] =
    useState("Tamu");

  const [opening, setOpening] =
    useState(false);

  const [opened, setOpened] =
    useState(false);

  const [isPlaying, setIsPlaying] =
    useState(false);

  /* =====================================================
     NAMA TAMU DARI URL
  ====================================================== */

  useEffect(() => {
    if (!pathname) {
      setGuestName("Tamu");
      return;
    }

    const pathParts = pathname
      .split("/")
      .filter(Boolean);

    const guestSlug =
      pathParts[pathParts.length - 1];

    if (!guestSlug) {
      setGuestName("Tamu");
      return;
    }

    let decodedGuest = guestSlug;

    try {
      decodedGuest =
        decodeURIComponent(guestSlug);
    } catch {
      decodedGuest = guestSlug;
    }

    const formattedGuest = decodedGuest
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const capitalizedGuest = formattedGuest
      .split(" ")
      .map((word) => {
        if (!word) return word;

        return (
          word.charAt(0).toUpperCase() +
          word.slice(1)
        );
      })
      .join(" ");

    setGuestName(
      capitalizedGuest || "Tamu"
    );
  }, [pathname]);

  /* =====================================================
     OPEN INVITATION
  ====================================================== */

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

  /* =====================================================
     MUSIC CONTROL
  ====================================================== */

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
    <main
      className="
        min-h-screen
        w-full
        bg-[#151515]
        text-white
      "
    >
      {/* =====================================================
          AUDIO
      ====================================================== */}

      <audio
        ref={audioRef}
        src="/gus-teja.mp3"
        loop
        preload="auto"
      />

      {/* =====================================================
          MUSIC BUTTON
      ====================================================== */}

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

            bg-black/75

            text-[#e1b954]

            shadow-lg

            backdrop-blur-md
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
          PAGE 1
          COVER
      ====================================================== */}

      <section
        className="
          relative
          mx-auto
          h-[100svh]
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
            z-0

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
                ? "bg-[linear-gradient(to_bottom,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.55)_25%,rgba(0,0,0,0.48)_50%,rgba(0,0,0,0.68)_100%)]"
                : "bg-[linear-gradient(to_bottom,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.48)_25%,rgba(0,0,0,0.42)_50%,rgba(0,0,0,0.55)_75%,rgba(0,0,0,0.72)_100%)]"
            }
          `}
        />

        {/* TOP LEFT */}

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

        {/* TOP RIGHT */}

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

        {/* BOTTOM LEFT */}

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

        {/* BOTTOM RIGHT */}

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

        {/* COVER CONTENT */}

        <div
          className="
            relative
            z-[4]

            flex
            h-full
            w-full
            flex-col

            items-center

            px-6
            pb-10
            pt-24

            text-center
          "
        >
          <div
            className={`
              flex
              flex-1
              w-full

              flex-col
              items-center
              justify-center

              transition-transform
              duration-[1300ms]

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

            <h1
              className="
                mt-2
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

            <p
              className="
                mt-2
                text-sm
                font-semibold
                tracking-[0.12em]
                text-white
              "
            >
              01.10.2026
            </p>
          </div>

          {/* GUEST AREA */}

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
                disabled:cursor-default
              "
            >
              Buka Undangan
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          PAGE 2
      ====================================================== */}

      {opened && (
        <section
          id="invitation"
          className="
            relative
            mx-auto
            h-[100svh]
            min-h-[760px]
            w-full
            max-w-[460px]
            overflow-hidden
            bg-black
            [animation:invitation-reveal_850ms_ease_both]
          "
        >
          {/* =================================================
              OVERLAY TRANSPARAN
              nanti taruh file:
              /public/texture-overlay.png
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-[1]
              bg-[url('/background.png')]
              bg-cover
              bg-center
              bg-no-repeat
              opacity-[0.10]
            "
          />

          {/* SIDE ORNAMENT LEFT */}

          <Image
            src="/ornament-side-left.png"
            alt=""
            width={180}
            height={380}
            className="
              pointer-events-none
              absolute
              -left-[38px]
              top-[72px]
              z-[2]
              h-auto
              w-[115px]
              object-contain
            "
          />

          {/* SIDE ORNAMENT RIGHT */}

          <Image
            src="/ornament-side-right.png"
            alt=""
            width={180}
            height={380}
            className="
              pointer-events-none
              absolute
              -right-[38px]
              top-[72px]
              z-[2]
              h-auto
              w-[115px]
              object-contain
            "
          />

          {/* CONTENT */}

          <div
            className="
              relative
              z-10

              flex
              h-full
              w-full
              flex-col

              items-center
              justify-center

              px-6
              py-8

              text-center
            "
          >
            {/* AKSARA */}

            <p
              className="
                text-[29px]
                font-medium
                leading-none
                text-[#e1b954]
                drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]
              "
            >
              ᬒᬁ ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ
            </p>

            {/* OM SWASTYASTU */}

            <h2
              className="
                mt-5
                font-[family-name:var(--font-allura)]
                text-[46px]
                font-normal
                leading-none
                text-[#e1b954]
                drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]
              "
            >
              Om Swastyastu
            </h2>

            {/* OPENING TEXT */}

            <p
              className="
                mx-auto
                mt-6
                max-w-[390px]
                text-[13px]
                font-medium
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

            {/* FOTO LINGKARAN PINGGIRAN EMAS */}

            <div
              className="
                relative
                mt-8
                flex
                h-[182px]
                w-[182px]
                shrink-0
                items-center
                justify-center
              "
            >
              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  border-[3px]
                  border-[#e1b954]
                "
              />

              <div
                className="
                  relative
                  h-[166px]
                  w-[166px]
                  overflow-hidden
                  rounded-full
                "
              >
                <Image
                  src="/person-1.jpg"
                  alt="I Gusti Ayu Putu Pramita Sari"
                  fill
                  priority
                  sizes="166px"
                  className="
                    object-cover
                    object-center
                  "
                />
              </div>
            </div>

            {/* NAMA */}

            <h3
              className="
                mt-7
                max-w-[420px]
                px-2
                font-[family-name:var(--font-allura)]
                text-[30px]
                font-normal
                leading-[1.08]
                text-white
                drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]
              "
            >
              Ni Putu Diana Dewi, S. Ked
            </h3>

            {/* DIVIDER */}

            <div
              className="
                mt-5
                flex
                w-[220px]
                items-center
                justify-center
                gap-3
                text-[#e1b954]
              "
            >
              <span
                className="
                  h-px
                  flex-1
                  bg-[#e1b954]/60
                "
              />

              <span
                className="
                  text-[12px]
                  text-[#e1b954]
                "
              >
                ✦
              </span>

              <span
                className="
                  h-px
                  flex-1
                  bg-[#e1b954]/60
                "
              />
            </div>

            {/* PUTRI DARI */}

            <p
              className="
                mt-4
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[#e1b954]
              "
            >
              Putri Dari
            </p>

            {/* PARENTS */}

            <p
              className="
                mt-2
                font-[family-name:var(--font-playfair)]
                text-[14px]
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
      )}
    </main>
  );
}