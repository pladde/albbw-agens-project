export interface BreadcrumbPath {
    label: string;
    link?: string;   // optional falls das letzte Element kein Link sein soll
    active: boolean;
}

export interface HeaderProps {
    breadcrumbPaths: BreadcrumbPath[];
}