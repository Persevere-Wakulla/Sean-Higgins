export default function slugify(name : string): string {
    return name.replaceAll(' ', '-');
}