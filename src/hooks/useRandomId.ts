export default function useRandomId() {
    return new Date().getTime() + Math.round(Math.random() * 1000).toString();
}
