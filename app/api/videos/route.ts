import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const videosDirectory = path.join(process.cwd(), 'public', 'Videos LoFi');
    const files = await fs.readdir(videosDirectory);
    
    const videos = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.mp4', '.webm'].includes(ext);
      })
      .map(file => ({
        name: path.parse(file).name,
        path: `/Videos LoFi/${file}`
      }));

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error al leer los videos:', error);
    return NextResponse.json(
      { error: 'Error al cargar los videos' },
      { status: 500 }
    );
  }
} 