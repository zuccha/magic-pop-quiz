import { Fragment } from "react/jsx-runtime";
import "./docs-page.css";
import { ReactNode } from "react";

const sections = [
  {
    title: "General",
    items: [
      {
        name: "Overview",
        icon: "star",
        route: "/docs",
      },
    ],
  },
  {
    title: "Quizzes",
    items: [
      {
        name: "Random",
        icon: "shuffle",
        route: "/docs/random-card",
      },
      {
        name: "Cards",
        icon: "layer-group",
        route: "/docs/cards-quiz",
      },
      {
        name: "Catalog",
        icon: "book",
        route: "/docs/catalog-quiz",
      },
    ],
  },
];

export type DocsPageProps = {
  children: ReactNode;
};

export default function DocsPage({ children }: DocsPageProps) {
  return (
    <div className="DocsPage">
      <div className="DocsPage_SidePanel">
        {sections.map((section) => (
          <Fragment key={section.title}>
            <h6>{section.title}</h6>
            <ul>
              {section.items.map((item) => {
                const selected = item.route === document.location.pathname;
                const className = selected ? "selected" : undefined;
                return (
                  <li key={item.route}>
                    <a className={className} href={item.route}>
                      <i className={`fa-solid fa-${item.icon}`} />
                      <b>{item.name}</b>
                    </a>
                  </li>
                );
              })}
            </ul>
          </Fragment>
        ))}
      </div>
      <div className="DocsPage_Content">{children}</div>
    </div>
  );
}
