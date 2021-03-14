export interface Annotation {
    text: string;
    textColor?: string;
}

export interface AnnotationInternal extends Annotation {
    hidden?: boolean;
}
