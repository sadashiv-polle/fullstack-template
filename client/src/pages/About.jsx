import Navbar from "../components/Navbar";

function HoverableText({ text }) {
  const words = text.split(" ");
  return (
    <p className="text-gray-600 leading-relaxed">
      {words.map((word, idx) => (
        <span
          key={idx}
          className="inline-block transition-transform duration-300 hover:text-blue-600 hover:scale-110 cursor-pointer"
          style={{ marginRight: "0.25rem" }}
        >
          {word}
          {idx !== words.length - 1 && " "}
        </span>
      ))}
    </p>
  );
}

function HoverableHeading({ text, className }) {
  const words = text.split(" ");
  return (
    <h2 className={className}>
      {words.map((word, idx) => (
        <span
          key={idx}
          className="inline-block transition-transform duration-300 hover:text-blue-600 hover:scale-110 cursor-pointer"
          style={{ marginRight: "0.25rem" }}
        >
          {word}
          {idx !== words.length - 1 && " "}
        </span>
      ))}
    </h2>
  );
}

function About() {
  return (
    <>
      <Navbar />
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">
          {/* Heading also split into words with spaces */}
          {"About".split(" ").map((word, idx) => (
            <span
              key={idx}
              className="inline-block transition-transform duration-300 hover:text-blue-600 hover:scale-110 cursor-pointer"
              style={{ marginRight: "0.25rem" }}
            >
              {word}
              {idx !== "About".split(" ").length - 1 && " "}
            </span>
          ))}
        </h1>

        <HoverableText
          text={`Welcome to our platform! We are dedicated to providing the best services to help you manage your tasks efficiently. Our team focuses on creating user-friendly solutions with the latest technologies. Whether you're here to learn more about our mission, our team, or how we can support your goals, you'll find everything you need right here.`}
        />

        <section className="mt-6">
          <HoverableHeading text="Our Mission" className="text-xl font-semibold mb-2" />
          <HoverableText text="To empower users with intuitive and reliable software tools that streamline daily workflows and enhance productivity." />
        </section>

        <section className="mt-6">
          <HoverableHeading text="Our Team" className="text-xl font-semibold mb-2" />
          <ul className="list-disc list-inside text-gray-700">
            {[
              "Sadashiv Doe - CEO",
              "Saiesh Smith - Lead Developer",
              "Kytan Johnson - Product Manager",
            ].map((member, idx) => (
              <li key={idx} className="cursor-default">
                {member.split(" ").map((word, idx2) => (
                  <span
                    key={idx2}
                    className="inline-block transition-transform duration-300 hover:text-blue-600 hover:scale-110 cursor-pointer"
                    style={{ marginRight: "0.25rem" }}
                  >
                    {word}
                    {idx2 !== member.split(" ").length - 1 && " "}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}

export default About;
