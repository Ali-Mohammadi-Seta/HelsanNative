// Example.tsx
import { FormItem } from "./FormItem";
import { FormList } from "./FormList";
import { Form, useForm, useWatch } from "./index";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const emailRules = [
  { required: true, message: "Email is required" },
  { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
  {
    validator: async (value: string) => {
      if (!value) return;
      await sleep(300); // async check
      if (value.endsWith("@banned.com")) {
        throw new Error("This domain is not allowed");
      }
    },
  },
];

export default function FormDemo() {
  const [form] = useForm();
  const email = useWatch<string>("email", form, "", { debounce: 1000 });
  console.log("🚀 ~ FormDemo ~ email:", email);
  return (
    <Form
      form={form}
      initialValues={{ email: "", password: "", users: [{ name: "" }] }}
      onFinish={(values) => {
        console.log("OK:", values);
      }}
      onFinishFailed={(e) => {
        console.log("FAILED:", e);
      }}
      className="max-w-md mx-auto p-4 border rounded-xl"
    >
      <FormItem name="email" label="Email" rules={emailRules}>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="you@example.com"
        />
      </FormItem>

      <FormItem
        name="password"
        label="Password"
        rules={[
          { required: true, message: "Password is required" },
          { min: 6, message: "Min 6 chars" },
        ]}
      >
        <input type="password" className="w-full border rounded px-3 py-2" />
      </FormItem>

      <FormList name="users">
        {(fields, { add, remove }) => (
          <div className="space-y-2">
            <div className="font-medium">Users</div>
            {fields.map((f, i) => (
              <FormItem
                key={f.key}
                name={`users.${i}.name`}
                label={`User #${i + 1} Name`}
                rules={[{ required: true }]}
              >
                <div className="flex gap-2">
                  <input className="flex-1 border rounded px-3 py-2" />
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="px-2 border rounded"
                  >
                    Remove
                  </button>
                </div>
              </FormItem>
            ))}
            <button
              type="button"
              onClick={() => add({ name: "" })}
              className="px-3 py-2 border rounded"
            >
              Add user
            </button>
          </div>
        )}
      </FormList>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="px-3 py-2 border rounded"
          onClick={() => form.resetFields()}
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-3 py-2 border rounded bg-black text-white"
        >
          Submit
        </button>
      </div>
    </Form>
  );
}
