import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Markdown from 'markdown-to-jsx';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Componente personalizado para processar os blocos de código Markdown
const CodeBlock = ({ language, children }) => {
  return (
    <div className="code-block">
      <SyntaxHighlighter language={language} style={tomorrow}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export const App = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const files = ['article1.md', 'article2.md', 'article3.md']; // Adicione mais nomes de arquivos conforme necessário
  const titles = ['Title 1', 'Title 2', 'Title 3']; // Adicione os títulos correspondentes
  const postsPerPage = 1; // Número de posts para exibir por página

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTitle, setCurrentTitle] = useState('');

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  useEffect(() => {
    const fetchMarkdownFiles = async () => {
      const fetchedPosts = [];
      for (const file_name of files) {
        try {
          const res = await import(`../../public/pages/${file_name}`);
          const markdownText = await fetch(res.default).then((res) => res.text());
          fetchedPosts.push(markdownText);
        } catch (err) {
          console.log(err);
        }
      }
      setPosts(fetchedPosts);
      setLoading(false);
    };

    fetchMarkdownFiles();
  }, [files]);

  useEffect(() => {
    if (titles[currentPage]) {
      setCurrentTitle(titles[currentPage]);
    }
  }, [currentPage, titles]);

  const offset = currentPage * postsPerPage;
  const paginatedPosts = posts.slice(offset, offset + postsPerPage);

  // Função para processar o Markdown e aplicar o realce de sintaxe aos blocos de código
  const processMarkdown = (markdownText) => {
    return (
      <Markdown
        options={{
          overrides: {
            Code: { component: CodeBlock }, // Use o componente CodeBlock para os blocos de código
          },
        }}
      >
        {markdownText}
      </Markdown>
    );
  };

  return (
    <section>
      <div className="w-full h-screen flex-row justify-center items-center">
        <div className="top-4 relative text-center text-zinc-200 text-4xl font-bold font-['Inter']">
          {currentTitle} {/* Exibe o título atual */}
        </div>
        <div className="m-10 w-80% h-4/5 bg-slate-200 border border-black overflow-scroll">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="prose relative p-4">{processMarkdown(paginatedPosts[0])}</div>
          )}
        </div>
        <div aria-label="Pagination" className="flex justify-center items-center">
          <ReactPaginate
            previousLabel={'previous'}
            nextLabel={'next'}
            breakLabel={'...'}
            pageCount={Math.ceil(posts.length / postsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName="flex justify-center space-x-1 text-white"
            pageClassName="inline-flex items-center justify-center w-8 h-8 p-1 border rounded-md shadow-md text-zinc-800 dark:bg-zinc-200 dark:border-zinc-400 text-lg hover:bg-stone-500"
            previousClassName="inline-flex items-center justify-center w-auto h-auto p-1 border rounded-md text-zinc-800 shadow-md dark:bg-zinc-200 dark:border-zinc-400 text-lg hover:bg-black"
            nextClassName="inline-flex items-center justify-center w-auto h-auto p-1 border rounded-md text-zinc-800 shadow-md dark:bg-zinc-200 dark:border-zinc-400 text-lg hover:bg-black"
            breakClassName="inline-flex items-center justify-center w-8 h-8 p-1 border rounded-md shadow-md text-zinc-800 dark:bg-zinc-200 dark:border-zinc-400 text-lg hover:bg-stone-500"
            activeClassName="scale-125 dark:bg-cyan-300"
          />
        </div>
      </div>
    </section>
  );
};
