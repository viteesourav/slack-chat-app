# 🚀 Slack Couch – The Ultimate Chat Workspace

Welcome to **Slack Couch**, your new favorite place to chat, collaborate, and occasionally procrastinate with style!  
This project is a full-featured, modern chat application inspired by Slack, built with the latest web technologies and deployed live on [Vercel](https://vercel.com/).  
Go ahead, [try it out now](https://slackcouch.vercel.app/) – we dare you not to fall in love! 😎

---

## 🛠️ Tech Stack

- **Next.js** – The React framework for production.
- **Convex** – Real-time database & authentication.
- **ShadCN/UI** – Beautiful, accessible UI components.
- **Jotai** – Global state management, because useState just wasn’t enough.
- **Quill** – Rich text editor for your message formatting needs.
- **date-fns** – Date formatting that won’t make you cry.
- **@emoji-mart/react** – Emoji picker, because words are hard.
- **Lucide Icons** – Crisp, modern icons.
- **bun / npm** – Package management (choose your fighter).
- **Vercel** – Lightning-fast deployment.

---

## ✨ Features

### Authentication

- **OAuth** with Google & GitHub
- **Password login** (with validation, because security matters)
- **Convex Auth** for seamless session management

### Workspaces & Channels

- Create, join, and switch between multiple workspaces
- Invite members with a shareable join code
- Create channels, rename them, and remove them (if you’re feeling destructive)
- Sidebar navigation with resizable panels

### Messaging

- Real-time chat with rich text formatting (thanks, Quill!)
- Emoji picker and image upload (because a picture is worth a thousand words)
- Threaded conversations and replies
- Message reactions (👍, 😂, 😍, and more)
- Edit and delete messages (regret-proof your chat history)
- Infinite scroll with lazy loading (your browser will thank you)

### Member Management

- Admins can update roles and kick members (with great power comes great responsibility)
- Members can leave workspaces (no hard feelings)
- Profile panel with member details

### Search & Navigation

- Command palette for searching channels and members
- Fast navigation between workspaces, channels, and profiles

### UI/UX

- Responsive design – looks great on desktop, tablet, and mobile
- Customizable themes and gradients
- Tooltips, popovers, dropdowns, and dialogs (all the modern UI goodness)
- Zero-state and error handling for a smooth experience

### Developer Experience

- Modular codebase with feature-based folders
- Custom hooks for API calls and state management
- TypeScript for type safety (and fewer headaches)
- ESLint and Prettier for code quality

---

## 🏆 Unique Selling Points (USP)

- **Real-time Everything:** Messages, reactions, and member updates happen instantly.
- **Threaded Conversations:** Never lose track of a side chat again.
- **Rich Editor:** Format your messages, add emojis, and upload images with ease.
- **Workspace Management:** Create, join, and switch workspaces like a boss.
- **Admin Controls:** Update roles, remove members, and keep your workspace tidy.
- **Humor Included:** Because life’s too short for boring chat apps.

---

## 🤹‍♂️ How to Run Locally

1. **Clone the repo:**

   ```sh
   git clone https://github.com/your-username/slack-couch.git
   cd slack-couch
   ```

2. **Install dependencies:**

   ```sh
   bun install
   # or
   npm install
   ```

3. **Start Next.js app:**

   ```sh
   bun run dev
   # or
   npm run dev
   ```

4. **Start Convex backend (in a second terminal):**

   ```sh
   bunx convex dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) and enjoy!**

---

## 🌍 Live Demo

Check out the live app on [Vercel](https://slackcouch.vercel.app/)
Invite your friends, create a workspace, and see how quickly you can fill it with memes.

---

## 📝 Documentation & Notes

- **Feature-based folder structure** for easy navigation.
- **Custom hooks** for fetching data, managing modals, and handling user confirmation.
- **Responsive layouts** using Tailwind CSS and ShadCN/UI.
- **Convex functions** for all database operations (queries, mutations, pagination).
- **Global state** managed with Jotai for modals and UI state.
- **Dynamic routing** for workspaces, channels, threads, and profiles.

---

## 🤔 Why Slack Couch?

Because every team deserves a comfy place to chat, collaborate, and occasionally share cat gifs.  
Slack Couch is built for speed, flexibility, and a little bit of fun.  
Try it, break it, and let us know what you think!

---

## 📬 Feedback & Contributions

Found a bug? Have a feature request?  
Open an issue or pull request – we love hearing from fellow developers and chat enthusiasts!

---

## 🦸‍♂️ Author

Built by [Sourav](https://github.com/viteesourav).  
Special thanks to everyone who helped test, break, and improve Slack Couch!

---

## 🐈 Easter Egg

If you find the hidden cat gif feature, you’re officially a Slack Couch power user.  
(Just kidding… or am I? 🐾)

---

**Happy chatting!**  
_If you read this far, you deserve a coffee. Or at least a new emoji._
