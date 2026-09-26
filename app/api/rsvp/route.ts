import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface RsvpItem {
  id: string;
  name: string;
  message: string;
  status: "Hadir" | "Tidak Hadir" | "Belum Konfirmasi";
  createdAt: string;
}

const dataDirectory = path.join(
  process.cwd(),
  "data"
);

const dataFile = path.join(
  dataDirectory,
  "rsvp.json"
);

async function ensureFile() {
  try {
    await fs.mkdir(dataDirectory, {
      recursive: true,
    });

    try {
      await fs.access(dataFile);
    } catch {
      await fs.writeFile(
        dataFile,
        "[]",
        "utf-8"
      );
    }
  } catch (error) {
    console.error(
      "Gagal menyiapkan file RSVP:",
      error
    );
  }
}

async function readRsvp(): Promise<RsvpItem[]> {
  await ensureFile();

  try {
    const content = await fs.readFile(
      dataFile,
      "utf-8"
    );

    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

/* =========================
   GET RSVP
========================= */

export async function GET() {
  try {
    const data = await readRsvp();

    const sortedData = [...data].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    return NextResponse.json(sortedData);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Gagal mengambil data RSVP.",
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
    );

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

    const allowedStatus = [
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

    const data = await readRsvp();

    const newRsvp: RsvpItem = {
      id: crypto.randomUUID(),
      name,
      message,
      status:
        status as RsvpItem["status"],
      createdAt: new Date().toISOString(),
    };

    data.push(newRsvp);

    await fs.writeFile(
      dataFile,
      JSON.stringify(data, null, 2),
      "utf-8"
    );

    return NextResponse.json(
      {
        message:
          "RSVP berhasil disimpan.",
        data: newRsvp,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Gagal menyimpan RSVP.",
      },
      {
        status: 500,
      }
    );
  }
}