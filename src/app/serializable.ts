//Interface for JSON parsing
export interface Serializable<T> {
    deserialize(input: Object): T;
}
