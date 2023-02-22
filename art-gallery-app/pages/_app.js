import GlobalStyle from "../styles";
import useSWR from "swr";
import Layout from "../component/layout/Layout";
import { useImmer } from "use-immer";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function App({ Component, pageProps }) {
  const [artPiecesInfo, updateArtPiecesInforename] = useImmer([]);

  const { data, error, isLoading } = useSWR(
    "https://example-apis.vercel.app/api/art",
    fetcher
  );
  if (error) return <div>{error.message}</div>;
  if (isLoading) return <div>loading...</div>;

  function handleToggleFavorite(slug) {
    updateArtPiecesInforename((draft) => {
      const artPieceLike = draft.find((piece) => piece.slug === slug);
      if (!artPieceLike) {
        return [
          ...draft,
          {
            slug,
            isFavorite: true,
          },
        ];
      } else {
        artPieceLike.isFavorite = !artPieceLike.isFavorite;
        return draft
      }
    });
  }
  function onSubmitHandler(slug, comment) {
    updateArtPiecesInfo((draft) => {
      const artPieceComment = draft.find((piece) => piece.slug === slug);
      if (!artPieceComment) {
        return [
          ...draft,
          {
            slug,
            isFavorite,
            comments: [comment],
          },
        ];
      } else {
        artPieceComment.comments.push(comment);
      }
    });
  }
  console.log("clicked_______trigger boolean", artPiecesInfo);
  return (
    <>
      <Layout />
      <GlobalStyle />
      <Component
        {...pageProps}
        pieces={data}
        artPiecesInfo={artPiecesInfo}
        onToggleFavorite={handleToggleFavorite}
        onSubmitHandler={onSubmitHandler}
        artPiecesInfo={artPiecesInfo}
      />
    </>
  );
}
