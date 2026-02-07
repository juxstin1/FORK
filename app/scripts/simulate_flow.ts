
import { runIdeaStage } from "../src/stages/idea";
import { runDesignStage } from "../src/stages/design";
import { runBuildStage } from "../src/stages/build";
import * as path from "path";

// 1. Mock Data (What Claude would generate)
const MOCK_IDEA_INPUT = {
    idea: "A simple To-Do List app",
    budget: 500,
    projectDir: path.resolve(__dirname, ".."), // Points to app/
};

const MOCK_PARSED_IDEA = {
    name: "SnapTask",
    tagline: "Tasks in a snap.",
    problem: "People forget things.",
    targetUser: {
        demographic: "General",
        goal: "Remember tasks",
        context: "On the go",
    },
    features: [
        {
            id: "f1",
            name: "Add Task",
            description: "Text input to add task",
            priority: "must-have" as const,
            requires: [],
            excludes: [],
        },
        {
            id: "f2",
            name: "List Tasks",
            description: "Show all tasks",
            priority: "must-have" as const,
            requires: [],
            excludes: [],
        }
    ],
    offlineSupport: "required" as const,
};

const MOCK_DESIGN = {
    theme: {
        colors: { primary: "#FF5733", background: "#FFFFFF" },
        typography: { header: "Inter-Bold", body: "Inter-Regular" },
    },
    navigation: {
        type: "stack" as const,
        routes: ["Home", "AddTask"],
    },
    screens: [
        {
            id: "home",
            name: "Home Screen",
            purpose: "List tasks",
            components: ["TaskList", "FAB"],
        },
    ],
    components: [
        { id: "c1", name: "TaskList", props: ["items"] },
    ],
};

const MOCK_BUILD_FILES = [
    {
        path: "app/(tabs)/index.tsx",
        content: `import { View, Text } from 'react-native';
export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-2xl font-bold text-[#FF5733]">SnapTask</Text>
    </View>
  );
}`,
    },
];

// 2. Execution Function
async function runSimulation() {
    console.log("🚀 Starting RORK Simulation...");

    // Step 1: Idea
    console.log("\n1. Running IDEA Stage...");
    await runIdeaStage(MOCK_IDEA_INPUT, MOCK_PARSED_IDEA);
    console.log("✅ Requirements saved.");

    // Step 2: Design
    console.log("\n2. Running DESIGN Stage...");
    await runDesignStage({
        projectDir: MOCK_IDEA_INPUT.projectDir,
        design: MOCK_DESIGN,
    });
    console.log("✅ Design spec saved.");

    // Step 3: Build
    console.log("\n3. Running BUILD Stage...");
    const result = await runBuildStage({
        projectDir: MOCK_IDEA_INPUT.projectDir,
        files: MOCK_BUILD_FILES,
    });

    if (result.errors.length > 0) {
        console.error("❌ Build errors:", result.errors);
    } else {
        console.log(`✅ Built ${result.written.length} files:`, result.written);
    }

    console.log("\n✨ Simulation Complete! Check the file system.");
}

runSimulation();
