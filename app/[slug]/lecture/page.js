

export default async function LecturePage({ params }) {
    const { slug } = await params;

    return (
        <h1>اسم الدرس: {slug}</h1>
    );
}