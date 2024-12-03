import { NextResponse } from 'next/server';
import { firebaseConfig } from '../../../lib/firebaseConfig';
import formidable from 'formidable';
import { getDatabase } from 'firebase/database';
import { getUser } from '../../../lib/firestore';
import { initializeApp } from 'firebase/app';
// import { uploadToIPFS, uploadToFirebaseStorage } from './uploadHandlers';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const address = searchParams.get('address');

    if (address) {
      const user = await getUser('users', address);

      if (user === null) {
        // User not customized
        return NextResponse.json(
          { message: 'Profile not found' },
          { status: 200 },
        );
      }

      return NextResponse.json(user, { status: 200 });
    }
  } catch (error) {
    console.error('Error handling GET request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       pathName,
//       content,
//       title,
//       link,
//       priority,
//       project,
//       tags,
//       collabs,
//       isNew,
//     } = body;

//     if (!pathName || typeof content !== 'string') {
//       return NextResponse.json(
//         { error: 'Folder, Document ID, and content are required' },
//         { status: 400 },
//       );
//     }

//     console.log('CONTENT ', content);
//     if (isNew) {
//       const incompletePath = `documents/${pathName}`;
//       console.log('incompletePath ', incompletePath);
//       const newDocRef = push(ref(database, incompletePath));
//       await set(newDocRef, {
//         content,
//         title,
//         link,
//         priority,
//         project,
//         tags,
//         collabs,
//       });

//       return NextResponse.json(
//         { message: 'Document created successfully', id: newDocRef.key },
//         { status: 201 },
//       );
//     } else {
//       const docRef = ref(database, `documents/${pathName}`);
//       await set(docRef, {
//         content,
//         title,
//         link,
//         priority,
//         project,
//         tags,
//         collabs,
//       });

//       // TODO Erase from route 0

//       return NextResponse.json(
//         { message: 'Document updated successfully' },
//         { status: 200 },
//       );
//     }
//   } catch (error) {
//     console.error('Error handling POST request:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 },
//     );
//   }
// }

export async function POST(req: Request) {
  const form = formidable({ multiples: true });
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return reject(
          NextResponse.json({ error: 'Error parsing form' }, { status: 400 }),
        );
      }

      try {
        const profile = JSON.parse(fields.profile as string);
        const avatar = files.avatar?.[0]; // Archivo del avatar
        const cover = files.cover?.[0]; // Archivo de la portada

        let avatarUrl = null;
        let coverUrl = null;

        if (avatar) {
          // Sube el avatar a IPFS o Firebase
          avatarUrl =
            (await uploadToIPFS(avatar.filepath)) ||
            (await uploadToFirebaseStorage(avatar.filepath, 'avatars'));
        }

        if (cover) {
          // Sube la portada a IPFS o Firebase
          coverUrl =
            (await uploadToIPFS(cover.filepath)) ||
            (await uploadToFirebaseStorage(cover.filepath, 'covers'));
        }

        // Combina las URLs subidas con el perfil
        const updatedProfile = { ...profile, avatarUrl, coverUrl };

        console.log('Updated Profile:', updatedProfile);

        resolve(
          NextResponse.json(
            { success: true, data: updatedProfile },
            { status: 200 },
          ),
        );
      } catch (error) {
        console.error('Error processing request:', error);
        reject(
          NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
          ),
        );
      }
    });
  });
}
