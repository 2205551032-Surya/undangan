import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type RsvpStatus =
  | "Hadir"
  | "Tidak Hadir"
  | "Belum Konfirmasi";

/* =========================
   GET RSVP
========================= */

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("rsvp")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("GET RSVP error:", error);

      return NextResponse.json(
        {
          message: "Gagal mengambil data RSVP.",
        },
        {
          status: 500,
        }
      );
    }

    const formattedData =
      data?.map((item) => ({
        id: item.id,
        name: item.name,
        message: item.message,
        status: item.status,
        createdAt: item.created_at,
      })) ?? [];

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("GET RSVP exception:", error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan pada server.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   POST RSVP
========================= */

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const name = String(
      body.name || ""
    ).trim();

    const message = String(
      body.message || ""
    ).trim();

    const status = String(
      body.status || ""
    ) as RsvpStatus;

    if (!name) {
      return NextResponse.json(
        {
          message: "Nama wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    if (!message) {
      return NextResponse.json(
        {
          message: "Ucapan wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    const allowedStatus: RsvpStatus[] = [
      "Hadir",
      "Tidak Hadir",
      "Belum Konfirmasi",
    ];

    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        {
          message:
            "Status kehadiran tidak valid.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await supabase
      .from("rsvp")
      .insert({
        name,
        message,
        status,
      })
      .select()
      .single();

    if (error) {
      console.error("POST RSVP error:", error);

      return NextResponse.json(
        {
          message: "Gagal menyimpan RSVP.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        message: "RSVP berhasil disimpan.",
        data: {
          id: data.id,
          name: data.name,
          message: data.message,
          status: data.status,
          createdAt: data.created_at,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST RSVP exception:", error);

    return NextResponse.json(
      {
        message:
          "Terjadi kesalahan saat menyimpan RSVP.",
      },
      {
        status: 500,
      }
    );
  }
}